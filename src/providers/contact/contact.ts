import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { contact, logs } from "../../models/contact";
import { ApiUrlModules } from "../../functions/config";

@Injectable()
export class ContactProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getCallLogs(): Observable<logs[]> {
    const url = this.profileUrl('contact/call-logs/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<logs[]>(url, httpOptions);
      }));
    }));
  }

  contactFilter(contactType: string, contactStatus: string, name: string): Observable<contact[]> {
    const url = this.profileUrl(`contact/filter/?n=${name}&ct=${contactType}&cs=${contactStatus}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<contact[]>(url, httpOptions);
      }));
    }));
  }

  callLogsFilter(answered: boolean, from: string, until: string, name: string): Observable<logs[]> {
    const url = this.profileUrl(`contact/call-logs/filter/?a=${answered}&f=${from}&u=${until}&n=${name}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<logs[]>(url, httpOptions);
      }));
    }));
  }

  callLogsMonthFilter(month: string): Observable<logs[]> {
    const url = this.profileUrl(`contact/call-logs/filter/month/?m=${month}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<logs[]>(url, httpOptions);
      }));
    }));
  }

  createCallLog(contactId: number): Observable<logs> {
    const url = this.profileUrl('contact/call-logs/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.post<logs>(url, { contactId }, httpOptions);
      }));
    }));
  }

  updateCallLog(id: number, value: boolean): Observable<null> {
    const url = this.profileUrl(`contact/call-logs/${id}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.put<null>(url, { answered: value }, httpOptions);
      }));
    }));
  }

  addContact(data: contact): Observable<any> {
    const url = this.profileUrl('contact/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.post<any>(url, data, httpOptions);
      }));
    }));
  }

  getContacts(fields: string): Observable<contact[]> {
    const url = this.profileUrl(`contact/?fields=${fields}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<contact[]>(url, httpOptions);
      }));
    }));
  }
  getContactDetail(contactId: number): Observable<contact> {
    const url = this.profileUrl(`contact/${contactId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<contact>(url, httpOptions);
      }));
    }));
  }

  updateContact(contactId: number, data: contact): Observable<contact> {
    let url = this.profileUrl(`contact/${contactId}/`);
    if (data.scheduleId && data.status === 'Appointment secured') {
      url = this.profileUrl(`contact/${contactId}/?xtra=add-schedule`);
    }
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.put<contact>(url, data, httpOptions);
      }))
    }));
  }

  removeContact(contactId: number): Observable<any> {
    const url = this.profileUrl(`contact/${contactId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.delete<any>(url, httpOptions);
      }));
    }));
  }

  callLogRemark(logId: number, remark: string): Observable<logs> {
    const url = this.profileUrl(`contact/call-logs/${logId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.put<logs>(url, { remark }, httpOptions);
      }));
    }));
  }

}
