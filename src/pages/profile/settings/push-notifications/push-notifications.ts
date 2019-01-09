import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { pushNotification } from "../../../../models/profile-settings";
import { ProfileProvider } from "../../../../providers/profile/profile";

@Component({
  selector: 'page-push-notifications',
  templateUrl: 'push-notifications.html',
})
export class PushNotificationsPage {

  reminder: boolean;
  agencySales: boolean;
  mentions: boolean;
  directMessage: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private profileProvider: ProfileProvider,
    private events: Events
  ) { }

  changeConf(event, subject) {
    const data = {
      subject: subject,
      value: event.value
    }
    this.update(data);
  }

  update(data) {
    this.profileProvider.updatePushNotification(data).subscribe(observe => {
      this.events.publish('settings:push-notification', observe.data);
    });
  }

  ionViewDidLoad() {
    const pushNotification: pushNotification = this.navParams.get('pushNotification');
    this.directMessage = pushNotification.direct_message;
    this.mentions = pushNotification.mentions;
    this.agencySales = pushNotification.activities;
    this.reminder = pushNotification.reminder;
  }

}
