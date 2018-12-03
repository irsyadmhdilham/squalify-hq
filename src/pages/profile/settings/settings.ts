import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { PushNotificationsPage } from "./push-notifications/push-notifications";
import { Colors } from "../../../functions/colors";
import { settings, socialNetAcc, pushNotification } from "../../../interfaces/profile-settings";
import { ProfileProvider } from "../../../providers/profile/profile";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  emailNotification: boolean;
  socialNetwork: socialNetAcc = {
    facebook: null,
    google: null,
    dropbox: null
  };
  pushNotification: pushNotification;
  navToPushNotif = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private profileProvider: ProfileProvider,
    private events: Events
  ) { }

  pushNotifications() {
    this.navToPushNotif = true;
    this.navCtrl.push(PushNotificationsPage, { pushNotification: this.pushNotification });
  }

  socialNetworkStyle(account) {
    if (!account) {
      return Colors.primary;
    }
    return Colors.dark;
  }

  ionViewDidLoad() {
    const settings: settings = this.navParams.get('settings');
    this.socialNetwork = settings.social_net_acc;
    this.emailNotification = settings.notifications.email_notification;
    this.pushNotification = settings.notifications.push_notification;
  }

  async updateEmailNotification(event) {
    const userId = await this.profileProvider.userId();
    this.profileProvider.updateEmailNotification(userId, { value: event.value }).subscribe(() => {
      this.events.publish('settings:email-notification', event.value);
    });
  }

  ionViewWillEnter() {
    this.navToPushNotif = false;
    this.events.subscribe('settings:push-notification', observe => {
      this.pushNotification = observe;
    });
  }

  ionViewWillLeave() {
    if (!this.navToPushNotif) {
      this.events.unsubscribe('settings:push-notification');
    }
  }

}
