import { APIResponse } from '../common.interface';

export interface CreateUserWidgetResponse extends APIResponse {
  widget: {
    insertedId: string;
  };
}
