import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse } from '../../interfaces/common.interface';
import { environment } from '../../../../environments/environment';
import {
  NewsletterListResponse,
  NewsletterPayload,
} from '../../interfaces/widgets/newsletter.interface';
import { CommonService } from '../common.service';
import {
  AdvertisementListResponse,
  AdvertisementPayload,
} from '../../interfaces/widgets/advertisement.interface';
import { CreateUserWidgetResponse } from '../../interfaces/widgets/user-widget.interface';
import { WidgetType } from '../../interfaces/common.enums';

@Injectable({
  providedIn: 'root',
})
export class UserWidgetService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  list(type: WidgetType) {
    return this.http.get<NewsletterListResponse | AdvertisementListResponse>(
      environment.baseAPIUrl + '/users/widgets/' + type,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  create(payload: NewsletterPayload | AdvertisementPayload) {
    return this.http.post<CreateUserWidgetResponse>(
      environment.baseAPIUrl + '/users/widgets',
      payload,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  edit(id: string, payload: NewsletterPayload | AdvertisementPayload) {
    return this.http.put<APIResponse>(
      environment.baseAPIUrl + '/users/widgets/' + id,
      payload,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  uploadImage(id: string, payload: FormData) {
    return this.http.post<APIResponse>(
      environment.baseAPIUrl + '/users/widgets/' + id + '/images',
      payload,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  editImage(id: string, payload: FormData) {
    return this.http.patch<APIResponse>(
      environment.baseAPIUrl + '/users/widgets/' + id + '/images',
      payload,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }
}
