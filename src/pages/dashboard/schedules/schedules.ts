import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AddScheduleComponent } from "../../../components/schedule/add-schedule/add-schedule";
import { ScheduleDetailPage } from "./schedule-detail/schedule-detail";
import { ScheduleProvider } from "../../../providers/schedule/schedule";

import { schedule } from "../../../interfaces/schedule";

@IonicPage()
@Component({
  selector: 'page-schedules',
  templateUrl: 'schedules.html',
})
export class SchedulesPage {

  schedules: schedule[] = [];
  pageStatus: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private scheduleProvider: ScheduleProvider
  ) { }

  addSchedule() {
    const modal = this.modalCtrl.create(AddScheduleComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.pageStatus = undefined;
        this.schedules.push(data.schedule);
      }
    });
  }

  fetch() {
    this.scheduleProvider.userId().then(userId => {
      this.scheduleProvider.getSchedules(userId).subscribe(observe => {
        this.schedules = observe.map(val => {
          return {
            ...val,
            date: new Date(val.date)
          }
        });
      }, (err: Error) => {
        console.log(err);
      });
    });
  }

  ionViewWillEnter() {
    this.fetch();
  }

  showDetail(schedule) {
    this.navCtrl.push(ScheduleDetailPage, { schedule });
  }

}
