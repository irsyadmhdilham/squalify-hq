import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { ApiUrlModules } from "../../functions/config";
import { group } from "../../interfaces/group";

@Injectable()
export class GroupProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getGroupDetail(userId: number): Observable<group> {
    const url = this.profileUrl('group', userId);
    return this.http.get<group>(url);
  }
}
