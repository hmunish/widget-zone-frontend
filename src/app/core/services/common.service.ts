import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private token: string;
  private readonly API_URL = environment.baseAPIUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    @Inject('LOCALSTORAGE') private localStorage: Storage
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.token = currentUser?.token || '';
  }

  public getRequestHeaders(): HttpHeaders {
    return new HttpHeaders({
      accept: 'application/json',
      authorization: `Bearer ${this.token || ''}`,
    });
  }

  public downloadFile(endpoint: string): Observable<Blob> {
    const url = `${this.API_URL}/${endpoint}`;
    return this.http.get(url, {
      headers: this.getRequestHeaders(),
      responseType: 'blob',
    });
  }

  setLocalStorageItem(key: string, value: string) {
    this.localStorage.setItem(key, value);
  }

  getLocalStorageItem(key: string) {
    return this.localStorage.getItem(key) ?? null;
  }

  removeLocalStorageItem(key: string) {
    this.localStorage.removeItem(key);
  }
}
