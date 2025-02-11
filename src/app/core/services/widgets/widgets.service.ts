import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { WidgetDetailResponse } from '../../interfaces/widgets/widgets.interface';
import { environment } from '../../../../environments/environment';
import { APIResponse } from '../../interfaces/common.interface';
import { WidgetType } from '../../interfaces/common.enums';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  detail(name: WidgetType) {
    return this.http.get<WidgetDetailResponse>(
      environment.baseAPIUrl + '/widgets/' + name,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }

  delete(id: string) {
    return this.http.delete<APIResponse>(
      environment.baseAPIUrl + '/users/widgets/' + id,
      {
        headers: this.commonService.getRequestHeaders(),
      }
    );
  }
}
