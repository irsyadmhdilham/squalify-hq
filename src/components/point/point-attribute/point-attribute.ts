import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController
} from "ionic-angular";
import { CallNumber } from "@ionic-native/call-number";
import { Store } from "@ngrx/store";

import { PointProvider } from "../../../providers/point/point";
import { AttributeFeatures } from "./attribute-features";
import { PointIncrement } from "../../../store/actions/points.action";

import { point } from "../../../models/point";
import { store } from "../../../models/store";

@Component({
  selector: 'point-attribute',
  templateUrl: 'point-attribute.html'
})
export class PointAttributeComponent extends AttributeFeatures implements OnChanges {

  @Input() img: string;
  @Input() attribute: string;
  @Input() each: number;
  @Input() editMode: boolean;
  @Input() todayPoint: point;
  @Input() pointType: string;
  @Input() pointPk: number;
  @Output() updatePoint = new EventEmitter();
  @Output() updatePointPk = new EventEmitter();
  @Input() dontShowToast
  point = 0;
  pk: number;
  attrPk: number;
  baseUrl = '../../../assets/imgs/points/';

  constructor(
    private pointProvider: PointProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private callNumber: CallNumber,
    private store: Store<store>
  ) {
    super(modalCtrl);
  }

  add() {
    const addPoint = () => {
      this.point += this.each;
      this.addMinus('add');
      this.store.dispatch(new PointIncrement(this.each));
      this.pointProvider.addPointEmit(this.each);
    };
    switch (this.attribute) {
      case 'Case closed':
        this.caseClosed().then(data => {
          if (data) {
            addPoint();
            this.addAction();
          }
        });
      break;
      case 'Referrals':
        this.addReferral().then(data => {
          if (data) {
            addPoint();
            this.addAction();
          }
        });
      break;
      case 'FTF/Nesting/Booth':
        this.addFTF().then(data => {
          if (data) {
            addPoint();
            this.addAction();
          }
        });
      break;
      case 'Appointment secured':
        this.addSchedule().then(data => {
          if (data) {
            addPoint();
          }
        })
      break;
      case 'Calls/Email/Socmed':
        this.addCalls().then(data => {
          if (data) {
            this.callNumber.callNumber(data.contact_no, true).then(() => {
              addPoint();
              this.addAction();
            });
          }
        });
      break;
      default:
        addPoint();
        this.addAction();
      break;
    }
  }

  addAction() {
    const data = {
      pk: this.pk,
      point: this.point,
      attribute: this.attribute,
      attr_pk: this.attrPk
    };
    const toast = this.toastCtrl.create({
      message: `${this.attribute} point added`,
      position: 'top',
      duration: 2000
    });
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    if (this.pk) {
      this.pointProvider.updatePoint(this.pk, true, data).subscribe(observe => {
        loading.dismiss();
        const attr = observe.attributes.filter(val => val.attribute === this.attribute)[0];
        this.attrPk = attr.pk;
        if (!this.dontShowToast) {
          toast.present();
        }
      }, (err: Error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error has occured',
          subTitle: err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
    } else {
      this.pointProvider.createPoint(true, data).subscribe(observe => {
        loading.dismiss();
        this.updatePointPk.emit(observe.pk);
        const attribute = observe.attributes.filter(val => val.attribute === this.attribute)[0];
        if (attribute) {
          this.attrPk = attribute.pk;
          if (!this.dontShowToast) {
            toast.present();
          }
        }
      }, (err: Error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error has occured',
          subTitle: err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
    }
  }

  minus() {
    if (this.point !== 0) {
      this.point -= this.each;
      this.addMinus('minus');
    }
  }

  ngOnChanges() {
    if (this.todayPoint) {
      this.pk = this.todayPoint.pk;
      const attribute = this.todayPoint.attributes.filter(val => val.attribute === this.attribute)[0];
      if (attribute) {
        this.attrPk = attribute.pk;
        this.point = attribute.point;
      }
    }
    if (this.pointPk) {
      this.pk = this.pointPk;
    }
  }

  addMinus(type) {
    this.updatePoint.emit({ type, pointType: this.pointType, point: this.each });
  }
}
