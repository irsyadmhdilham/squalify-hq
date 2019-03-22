import { Component } from '@angular/core';
import { NavController, NavParams, InfiniteScroll, ModalController } from 'ionic-angular';

import { PointProvider } from "../../../providers/point/point";
import { point } from "../../../models/point";

import { PointDetailPage } from "./point-detail/point-detail";
import { PointGroupMemberPage } from "./point-group-member/point-group-member";
import { PointDetailSummaryComponent } from "../../../components/point/point-detail-summary/point-detail-summary";

@Component({
  selector: 'page-points',
  templateUrl: 'points.html',
})
export class PointsPage {

  pageStatus: string;
  segment = 'personal';
  points: point[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private pointProvider: PointProvider,
    private modalCtrl: ModalController
  ) { }

  changeSegment(value) {
    if (value === 'personal') {
      this.fetch();
    } else {
      this.fetchGroup();
    }
  }

  fetch() {
    this.pageStatus = 'loading';
    this.pointProvider.getPoints().subscribe(observe => {
      this.pageStatus = undefined;
      const points = observe.map(val => {
        return {
          ...val,
          date: new Date(val.date)
        };
      });
      this.points = points;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  fetchGroup() {
    this.pageStatus = 'loading';
    this.pointProvider.getGroupPoints().subscribe(observe => {
      this.pageStatus = undefined;
      this.points = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  fetchMoreGroup(infiniteScroll: InfiniteScroll) {
    const x = this.points.length;
    this.pointProvider.fetchGroupMore(x).subscribe(points => {
      const all = this.points.concat(points);
      this.points = all;
      infiniteScroll.complete();
    });
  }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  ionViewDidLoad() {
    this.fetch();
  }

  navigate(point) {
    this.navCtrl.push(PointDetailPage, { pointId: point.pk });
  }

  navToMember(date: string) {
    this.navCtrl.push(PointGroupMemberPage, { date });
  }

  summary() {
    const modal = this.modalCtrl.create(PointDetailSummaryComponent);
    modal.present();
  }
}
