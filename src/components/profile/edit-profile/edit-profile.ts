import { Component } from '@angular/core';
import {
  ViewController,
  NavParams,
  AlertController,
  LoadingController,
  Platform,
  normalizeURL
} from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { Observable, Observer } from "rxjs";
import { first, switchMap, catchError, map } from "rxjs/operators";

import { ProfileProvider } from "../../../providers/profile/profile";

interface uploadImage {
  upload: boolean;
  image?: string;
  succeed?: boolean;
}

@Component({
  selector: 'edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfileComponent {

  name: string;
  profileImage: string;
  imageToUpload: string

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private profileProvider: ProfileProvider,
    private loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    private camera: Camera,
    private platform: Platform
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changeImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    const isCordova = this.platform.is('cordova');
    if (isCordova) {
      this.platform.ready().then(() => {
        this.camera.getPicture(options).then(async imageData => {
          const imgPath = (window as any).Ionic.WebView.convertFileSrc(imageData);
          this.profileImage = imgPath;
          this.imageToUpload = imageData;
        }).catch(() => {});
      });
    }
  }

  uploadImage(): Observable<uploadImage> {
    const obs: Observable<uploadImage> = Observable.create((observer: Observer<uploadImage>) => {
      const isCordova = this.platform.is('cordova');
      if (isCordova && this.imageToUpload) {
        const fileTransfer: FileTransferObject = this.transfer.create(),
        options: FileUploadOptions = {
          fileKey: 'profile_image',
          chunkedMode: false,
          mimeType: 'image/jpeg',
          httpMethod: 'PUT',
          headers: {}
        };
        this.platform.ready().then(async () => {
          const profileURL = await this.profileProvider.profileUrl('profile-image/').toPromise();
          fileTransfer.upload(this.imageToUpload, profileURL, options).then(data => {
            const response = JSON.parse(data.response);
            observer.next({upload: true, succeed: true, image: response.profile_image});
          }).catch(err => observer.error(err));
        });
      } else {
        observer.next({upload: false})
      }
    });
    obs.pipe(first());
    return obs;
  }

  profileImageView() {
    return { background: `url('${this.profileImage}') center center no-repeat / cover` };
  }

  submitChanges(checkName) {
    try {    
      if (!checkName.valid) {
        throw 'Please insert name';
      }
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.uploadImage().pipe(
        catchError(err => Observable.of(err)),
        switchMap((upload: uploadImage) => {
          return this.profileProvider.updateProfile({name: this.name}).pipe(map(data => {
            return { name: data.name, profileImage: upload.image };
          }));
        })
      ).subscribe(observe => {
        loading.dismiss();
        this.viewCtrl.dismiss({
          name: observe.name,
          profileImage: observe.profileImage
        });
      }, (err: Error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Empty required field',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  ionViewDidLoad() {
    const name = this.navParams.get('name'),
          profileImage = this.navParams.get('profileImage');
    this.name = name;
    this.profileImage = profileImage;
  }

}
