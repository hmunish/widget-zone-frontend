import { WidgetType } from '../common.enums';
import { APIResponse } from '../common.interface';

export interface AdvertisementPayload {
  id?: string;
  type: {
    id: string;
    name: WidgetType;
  };
  data: {
    title: string;
    styles: {
      color: string;
      bgColor: string;
    };
  };
  properties?: string[];
}

export interface Advertisement {
  _id: string;
  user: { id: string };
  widget: {
    type: {
      id: string;
      name: WidgetType;
    };
    data: {
      title: string;
      image: {
        url: string;
        publicId: string;
      };
      styles: {
        color: string;
        bgColor: string;
      };
    };
    properties: string[];
  };
}

export interface AdvertisementListResponse extends APIResponse {
  data: Advertisement[];
}
