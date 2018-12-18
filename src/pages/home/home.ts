import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import * as socketio from "socket.io-client";
import { Store, select } from "@ngrx/store";
import { FetchAgency } from "../../ngrx/actions/agency.action";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { AgencyProvider } from "../../providers/agency/agency";
import { PostProvider } from "../../providers/post/post";
import { post } from "../../interfaces/post";
import { agency } from "../../interfaces/agency";

import { AddSalesComponent } from "../../components/sales/add-sales/add-sales";
import { AddContactComponent } from "../../components/contact/add-contact/add-contact";
import { AddScheduleComponent } from "../../components/schedule/add-schedule/add-schedule";
import { NotificationsPage } from '../notifications/notifications';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  agency: Observable<agency> = this.store.pipe(select('agency'))
  agencyImage: Observable<string> = this.agency.pipe(map(value => value.agency_image));
  agencyName: Observable<string> = this.agency.pipe(map(value => value.name));
  pk: number;
  company: string;
  newPost = 0;
  posts: post[] = [];
  likeStatus: { index: number, status: boolean; };
  points = {
    personal: 0,
    group: 0,
    agency: 0
  };
  io = socketio(this.agencyProvider.wsBaseUrl('home'));

  constructor(
    public navCtrl: NavController,
    private agencyProvider: AgencyProvider,
    private modalCtrl: ModalController,
    private postProvider: PostProvider,
    private navParams: NavParams,
    private store: Store<agency>
  ) { }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  agencyImageView() {
    return this.agency.pipe(map(value => {
      return {
        background: `url('${value.agency_image}') center center no-repeat / cover`
      };
    }));
  }

  ionViewWillEnter() {
    const likeStatus = this.navParams.get('likeStatus');
    this.likeStatus = likeStatus;
  }

  async fetchBasicInfo() {
    const agencyId = await this.agencyProvider.agencyId(),
          userId = await this.agencyProvider.userId();
    this.agencyProvider.getAgencyDetail(agencyId, 'pk,company,agency_image,name,points', userId).subscribe(observe => {
      this.points = observe.points;
      this.homeWs();
    });
  }

  async fetchPosts() {
    const agencyId = await this.agencyProvider.agencyId();
    this.agencyProvider.getPosts(agencyId).subscribe(observe => {
      this.newPost = 0;
      this.posts = observe;
    });
  }

  createPost(attribute) {
    const createModal = (component) => {
      return this.modalCtrl.create(component);
    };
    const newPost = () => {
      this.io.emit('new post', {
        namespace: `${this.company}:${this.pk}`
      });
    }
    switch (attribute) {
      case 'sales':
        const sales = createModal(AddSalesComponent);
        sales.present();
        sales.onDidDismiss(data => {
          if (data) {
            newPost();
          }
        });
      break;
      case 'contact':
        const contact = createModal(AddContactComponent);
        contact.present();
      break;
      case 'schedule':
        const schedule = createModal(AddScheduleComponent);
        schedule.present();
      break;
    }
  }

  homeWs() {
    const namespace = `${this.company}:${this.pk}`;
    this.io.on(`${namespace}:new post`, () => {
      this.newPost++;
    });
    
    this.io.on(`${namespace}:comment post`, data => {
      const i = data.index;
      const post = this.posts[i];
      post.comments++;
    });

    this.io.on(`${namespace}:like post`, data => {
      const i = data.index,
            like = data.like;
      this.posts[i].likes.push(like);
    });

    this.io.on(`${namespace}:unlike post`, data => {
      const i = data.index,
            unliker = data.unliker;
      const post = this.posts[i],
            x = post.likes.findIndex(val => val.liker === unliker);
      post.likes.splice(x, 1);
    });
  }

  ionViewDidLoad() {
    // this.fetchBasicInfo();
    this.store.dispatch(new FetchAgency())
    this.fetchPosts();
  }

  likePost() {
    return new Promise(async resolve => {
      const agencyId = await this.postProvider.agencyId(),
            userId = await this.postProvider.userId();
      this.postProvider.likePost(agencyId, this.pk, { userId }).subscribe(observe => {
        resolve(observe);
      });
    });
  }

  unlikePost(postId, likeId) {
    return new Promise(async resolve => {
      const agencyId = await this.postProvider.agencyId();
      this.postProvider.unlikePost(agencyId, postId, likeId).subscribe(() => {
        resolve();
      });
    })
  }
}
