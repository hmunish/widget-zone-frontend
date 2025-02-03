import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse } from '../../interfaces/common.interface';
import { environment } from '../../../../environments/environment';
import {
  NewsletterListResponse,
  NewsletterPayload,
} from '../../interfaces/widgets/newsletter.interface';
import { CommonService } from '../common.service';
import { WidgetDetailResponse } from '../../interfaces/widgets/widgets.interface';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  list() {
    return this.http.get<NewsletterListResponse>(
      environment.baseAPIUrl + '/users/widgets',
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  create(payload: NewsletterPayload) {
    return this.http.post<APIResponse>(
      environment.baseAPIUrl + '/users/widgets',
      payload,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  edit(id: string, payload: NewsletterPayload) {
    return this.http.put<APIResponse>(
      environment.baseAPIUrl + '/users/widgets/' + id,
      payload,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }
}
