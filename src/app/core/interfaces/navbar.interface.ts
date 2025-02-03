import { APIResponse } from './common.interface';

export interface WidgetListResponse extends APIResponse {
  data: Widget[];
}

export interface Widget{
  id: string;
  name: string;
  description: string;
}
