import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { environment } from '../../../environments/environment';
import { GetUserProfileResponse, User } from '../interfaces/user.interface';
import { APIResponse } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  getProfile() {
    return this.http.get<GetUserProfileResponse>(
      environment.baseAPIUrl + '/users/profile',
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  updateProfile(user: Partial<User>) {
    return this.http.patch<APIResponse>(
      environment.baseAPIUrl + '/users/profile',
      user,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }
}
