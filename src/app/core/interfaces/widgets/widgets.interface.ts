import { APIResponse } from '../common.interface';

export interface Widget {
  _id: string;
  name: string;
  description: string;
  code: string;
}

export interface WidgetDetailResponse extends APIResponse {
  data: Widget;
}
