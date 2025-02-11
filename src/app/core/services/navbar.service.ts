import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Widget, WidgetListResponse } from '../interfaces/navbar.interface';
import { environment } from '../../../environments/environment';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  widgets: Widget[] = [];

  fetchWidgets() {
    return this.http.get<WidgetListResponse>(
      environment.baseAPIUrl + '/widgets',
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }
}
