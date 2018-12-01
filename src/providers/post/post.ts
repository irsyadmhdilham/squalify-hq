import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";
import { ApiUrlModules } from "../../functions/config";

import { comment, like } from "../../interfaces/post";

@Injectable()
export class PostProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  postComment(agencyId, postId: number, data: any): Observable<comment> {
    const url = this.agencyUrl(agencyId, `post/${postId}/comment`);
    return this.http.post<comment>(url, data);
  }

  getComments(agencyId, postId: number): Observable<comment[]> {
    const url = this.agencyUrl(agencyId, `post/${postId}/comment`);
    return this.http.get<comment[]>(url);
  }

  likePost(agencyId, postId: number, data: { userId: any }): Observable<like> {
    const url = this.agencyUrl(agencyId, `post/${postId}/like`);
    return this.http.post<like>(url, data);
  }

  unlikePost(agencyId, postId: number, likeId: number): Observable<null> {
    const url = this.agencyUrl(agencyId, `post/${postId}/unlike/${likeId}`);
    return this.http.delete<null>(url);
  }

}
