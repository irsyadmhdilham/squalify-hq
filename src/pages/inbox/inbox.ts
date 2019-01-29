import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { Store, select } from "@ngrx/store";

import { InboxComposeComponent } from "../../components/inbox/inbox-compose/inbox-compose";
import { CreateGroupchatComponent } from "../../components/inbox/create-groupchat/create-groupchat";
import { InboxProvider } from "../../providers/inbox/inbox";

import { inbox, message, groupInbox } from "../../models/inbox";
import { member } from "../../models/agency";
import { store } from "../../models/store";

import { ChatroomPage } from "./chatroom/chatroom";
import { GroupChatroomPage } from "./group-chatroom/group-chatroom";
import { NotificationsPage } from "../notifications/notifications";

@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  inboxes: inbox[] = [];
  agencyChat: groupInbox;
  groupChat: groupInbox;
  uplineGroupChat: groupInbox;
  pageStatus: string;
  navToChatroom = false;
  listenNewInbox: (inbox: inbox, pk: number) => void;
  listenNewMessage: (message: message, pk: number) => void;
  listenClearUnread: (pk: number) => void;
  listenAgencyClearUnread: (pk: number) => void;
  listenGroupClearUnread: (pk: number) => void;
  listenUplineGroupClearUnread: (pk: number) => void;
  newMessageListener: Subscription;
  newInboxListener: Subscription;
  newGroupMessageListener: Subscription;
  storeListener: Subscription;
  notifications$ = this.store.pipe(select('notifications'));

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private inboxProvider: InboxProvider,
    private events: Events,
    private store: Store<store>
  ) { }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  groupImage(obj: groupInbox) {
    if (obj) {
      let url = obj.created_by.profile_image;
      if (obj.role === 'agency') {
        url = obj.agency.agency_image;
      }
      return {
        background: `url('${url}') center center no-repeat / cover`
      };
    }
    return false;
  }

  groupUnread(obj: groupInbox) {
    if (obj) {
      return obj.unread;
    }
    return false;
  }

  toChatroom(inbox: inbox, composeNew?: member) {
    this.navToChatroom = true;
    if (inbox.chat_with) {
      this.navCtrl.push(ChatroomPage, { inbox, composeNew });
    } else {
      this.toGroupChatroom(inbox);
    }
  }

  toGroupChatroom(inbox: inbox) {
    this.navToChatroom = true;
    this.navCtrl.push(GroupChatroomPage, { inbox });
  }

  createGroup() {
    const modal = this.modalCtrl.create(CreateGroupchatComponent);
    modal.present();
  }

  composeChat() {
    const modal = this.modalCtrl.create(InboxComposeComponent);
    modal.present();
    modal.onDidDismiss((profile: member) => {
      if (profile) {
        const inbox = this.inboxes.find(val => val.chat_with.pk === profile.pk);
        if (inbox) {
          this.toChatroom(inbox);
        } else {
          this.toChatroom(null, profile);
        }
      }
    });
  }

  getInbox() {
    this.pageStatus = 'loading';
    this.inboxProvider.getInbox().subscribe(inboxes => {
      this.pageStatus = undefined;
      this.inboxes = inboxes;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  lastMessage(inbox: inbox) {
    if (inbox.group_chat) {
      const groupChat = inbox.group_chat;
      const len = groupChat.messages.length;
      if (len > 0) {
        return groupChat.messages[len - 1].text;
      }
    } else {
      const len = inbox.messages.length;
      if (len > 0) {
        return inbox.messages[len - 1].text;
      }
    }
  }

  eventsListener() {
    this.listenNewInbox = (inbox: inbox) => {
      this.inboxes.unshift(inbox);
    };
  
    this.listenNewMessage = (message: message, pk: number) => { 
      const i = this.inboxes.findIndex(val => val.pk === pk);
      this.inboxes[i].messages.push(message);
      const inbox = this.inboxes.splice(i, 1);
      this.inboxes.unshift(inbox[0]);
    };
  
    this.listenClearUnread = (pk: number) => {
      const i = this.inboxes.findIndex(val => val.pk === pk);
      this.inboxes[i].unread = 0;
    };

    this.listenAgencyClearUnread = () => {
      if (this.agencyChat) {
        this.agencyChat.unread = 0;
      }
    };
    this.listenGroupClearUnread = () => {
      if (this.groupChat) {
        this.groupChat.unread = 0;
      }
    };
    this.listenUplineGroupClearUnread = () => {
      if (this.uplineGroupChat) {
        this.uplineGroupChat.unread = 0;
      }
    };
    this.events.subscribe('inbox: new inbox', this.listenNewInbox);
    this.events.subscribe('inbox: new message', this.listenNewMessage);
    this.events.subscribe('inbox: clear unread', this.listenClearUnread);
    this.events.subscribe('inbox: agency clear unread', this.listenAgencyClearUnread);
    this.events.subscribe('inbox: group clear unread', this.listenGroupClearUnread);
    this.events.subscribe('inbox: upline group clear unread', this.listenUplineGroupClearUnread);
  }

  ionViewWillEnter() {
    if (!this.navToChatroom) {
      this.getInbox();
      this.listenWsEvents();
    }
    this.navToChatroom = this.navParams.get('fromChatroom');
    this.eventsListener();
  }

  ionViewWillLeave() {
    if (!this.navToChatroom) {
      this.events.unsubscribe('inbox: new inbox', this.listenNewInbox);
      this.events.unsubscribe('inbox: new message', this.listenNewMessage);
      this.events.unsubscribe('inbox: clear unread', this.listenClearUnread);
      this.events.unsubscribe('inbox: agency clear unread', this.listenAgencyClearUnread);
      this.events.unsubscribe('inbox: group clear unread', this.listenGroupClearUnread);
      this.events.unsubscribe('inbox: upline group clear unread', this.listenUplineGroupClearUnread);
      this.newMessageListener.unsubscribe();
      this.newInboxListener.unsubscribe();
      this.newGroupMessageListener.unsubscribe();
      if (this.storeListener) {
        this.storeListener.unsubscribe();
      }
    }
  }

  listenWsEvents() {
    this.newInboxListener = this.inboxProvider.newInbox$.subscribe(inbox => {
      this.inboxes.unshift(inbox);
    });

    this.newMessageListener = this.inboxProvider.newMessage$.subscribe(response => {
      const i = this.inboxes.findIndex(val => val.pk === response.pk);
      const inbox = this.inboxes[i];
      inbox.messages.push(response.message);
      inbox.unread++;
      const splicedInbox = this.inboxes.splice(i, 1);
      this.inboxes.unshift(splicedInbox[0]);
    });

    this.newGroupMessageListener = this.inboxProvider.newGroupMessage$.subscribe(async response => {
      const userId = await this.inboxProvider.userId().toPromise();
      if (response.sender !== userId) {
        if (this.agencyChat.groupId === response.groupChatId) {
            this.agencyChat.unread++;
        }
        if (this.groupChat) {
          if (this.groupChat.groupId === response.groupChatId) {
            this.groupChat.unread++;
          }
        }
        if (this.uplineGroupChat) {
          if (this.uplineGroupChat.groupId === response.groupChatId) {
            this.uplineGroupChat.unread++;
          }
        }
      }
    });
  }

}
