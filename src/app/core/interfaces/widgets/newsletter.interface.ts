import { APIResponse } from '../common.interface';

export interface Newsletter {
  _id: string;
  user: { id: string };
  widget: {
    type: {
      id: string;
      name: string;
    };
    data: {
      title: string;
      message: string;
      styles: {
        color: string;
        bgColor: string;
      };
    };
    properties: string[];
  };
}

export interface NewsletterPayload {
  id?: string;
  type: {
    id: string;
    name: string;
  };
  data: {
    title: string;
    message: string;
    styles: {
      color: string;
      bgColor: string;
    };
  };
}

export interface NewsletterListResponse extends APIResponse {
  data: Newsletter[];
}

export interface NewsletterPropertyModalData {
  widgetId: string;
  properties: string[];
}
