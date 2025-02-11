import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  APIResponse,
  AuthResponse,
  CurrentUser,
  TokenPayload,
} from '../interfaces/common.interface';
import { jwtDecode } from 'jwt-decode';
import { SignInPayload, SignUpPayload } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    @Inject('LOCALSTORAGE') private localStorage: Storage
  ) {}

  signup(payload: SignUpPayload) {
    return this.http.post<APIResponse>(
      environment.baseAPIUrl + '/signup',
      payload
    );
  }

  signin(payload: SignInPayload) {
    return this.http
      .post<AuthResponse>(environment.baseAPIUrl + '/signin', payload)
      .pipe(
        map((response: AuthResponse) => {
          if (!response.token) {
            return false;
          }

          const tokenPayload = jwtDecode<TokenPayload>(response.token);

          this.localStorage.setItem(
            'currentUser',
            JSON.stringify({
              token: response.token,
              emailId: tokenPayload.user.emailId,
              id: tokenPayload.user.id,
              expiration: new Date(tokenPayload.exp * 1000),
              firstName: tokenPayload.user.firstName,
              lastName: tokenPayload.user.lastName,
            })
          );

          return true;
        })
      );
  }

  logout(): void {
    this.localStorage.removeItem('currentUser');
    location.reload();
  }

  getCurrentUser(): CurrentUser | null {
    const item = this.localStorage.getItem('currentUser');

    return item ? (JSON.parse(item) as CurrentUser) : null;
  }
}
