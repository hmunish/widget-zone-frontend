import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserWidgetPropertiesModalService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  add(widgetId: string, property: string) {
    return this.http.post(
      environment.baseAPIUrl + '/users/widgets/' + widgetId + '/properties',
      { property },
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  delete(widgetId: string, property: string) {
    return this.http.delete(
      environment.baseAPIUrl + '/users/widgets/' + widgetId + '/properties',
      {
        body: {
          property,
        },
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }
}
