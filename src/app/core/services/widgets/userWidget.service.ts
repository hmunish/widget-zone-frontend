import { HttpClient, HttpParams } from '@angular/common/http';
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
import { TicketStatus, WidgetType } from '../../interfaces/common.enums';
import { TicketManagementPayload } from '../../interfaces/widgets/ticket-management.interface';
import { TicketListResponse } from '../../interfaces/widgets/ticket-list.interface';
import { SubscriberListResponse } from '../../interfaces/widgets/subscriber-list.interface';

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

  create(
    payload: NewsletterPayload | AdvertisementPayload | TicketManagementPayload
  ) {
    return this.http.post<CreateUserWidgetResponse>(
      environment.baseAPIUrl + '/users/widgets',
      payload,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  edit(
    id: string,
    payload: NewsletterPayload | AdvertisementPayload | TicketManagementPayload
  ) {
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

  getTickets(status?: string | null, countByMonth?: boolean) {
    let params = new HttpParams();

    if (countByMonth) {
      params = params.set('countByMonth', true);
    }

    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<TicketListResponse>(
      environment.baseAPIUrl + '/users/widgets/tickets',
      {
        headers: this.commonService.getRequestHeaders(),
        params,
      }
    );
  }

  updateTicketStatus(widgetId: string, ticketId: string, status: TicketStatus) {
    return this.http.patch<APIResponse>(
      environment.baseAPIUrl +
        '/users/widgets/' +
        widgetId +
        '/tickets/' +
        ticketId,
      { status },
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  getSubscribers(countByMonth?: boolean) {
    let params = new HttpParams();

    if (countByMonth) {
      params = params.set('countByMonth', true);
    }
    return this.http.get<SubscriberListResponse>(
      environment.baseAPIUrl + '/users/widgets/subscribers',
      {
        headers: this.commonService.getRequestHeaders(),
        params,
      }
    );
  }
}
