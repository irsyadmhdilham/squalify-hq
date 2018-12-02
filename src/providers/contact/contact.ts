import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { contact } from "../../interfaces/contact";
import { ApiUrlModules } from "../../functions/config";

@Injectable()
export class ContactProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  addContact(userId, data: contact): Observable<any> {
    const url = this.profileUrl(userId, 'contact/');
    return this.http.post<any>(url, data);
  }

  getContacts(userId, fields: string): Observable<contact[]> {
    const url = this.profileUrl(userId, `contact?fields=${fields}`);
    return this.http.get<contact[]>(url);
  }
  getContactDetail(userId, contactId: number): Observable<contact> {
    const url = this.profileUrl(userId, `contact/${contactId}`);
    return this.http.get<contact>(url);
  }

  updateContact(userId, contactId: number, data: contact): Observable<contact> {
    let url = this.profileUrl(userId, `contact/${contactId}`);
    if (data.scheduleId && data.status === 'Appointment secured') {
      url = this.profileUrl(userId, `contact/${contactId}?xtra=add-schedule`);
    }
    return this.http.put<contact>(url, data);
  }

  removeContact(userId, contactId: number): Observable<any> {
    const url = this.profileUrl(userId, `contact/${contactId}`);
    return this.http.delete<any>(url);
  }

}
