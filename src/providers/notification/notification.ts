import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";
import { notification } from "../../models/notification";

@Injectable()
export class NotificationProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getNotifications(): Observable<notification[]> {
    const url = this.profileUrl('notification');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<notification[]>(url, { headers }).pipe(
          map(value => {
            return value.map(val => {
              return {
                ...val,
                timestamp: new Date(val.timestamp)
              }
            });
          }));
      }));
    }));
  }

  getNotifsReadTotal(): Observable<number> {
    const url = this.profileUrl('notification/seen');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<number>(url, { headers });
      }));
    }));
  }

  read(notifId: number): Observable<boolean> {
    const url = this.profileUrl(`notification/${notifId}/`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.put<boolean>(url, null, { headers });
      }));
    }));
  }

  clearSeen(): Observable<boolean> {
    const url = this.profileUrl(`notification/clear-seen/`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.put<boolean>(url, null, { headers });
      }));
    }));
  }

}
