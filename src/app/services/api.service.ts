import { Injectable } from '@angular/core';
import {ChatInboxComponent} from '../components/chat-inbox/chat-inbox.component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  HOST = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }


  get(endpoint): Observable<any> {
    return this.http.get(this.HOST + endpoint);
  }

  post(endpoint, data): Observable<any> {
    return this.http.post(this.HOST + endpoint, data);
  }

  put(endpoint, data): Observable<any> {
    return this.http.put(this.HOST + endpoint, data);
  }

  del(endpoint): Observable<any> {
    return this.http.delete(this.HOST + endpoint);
  }

  patch(endpoint, body): Observable<any> {
    return this.http.patch(this.HOST + endpoint, body);
  }

}
