import { TicketStatus, WidgetType } from '../common.enums';
import { APIResponse } from '../common.interface';

export interface TicketManagementPayload {
  _id: string;
  user: { id: string };
  widget: {
    type: {
      id: string;
      name: WidgetType;
    };
    data: {
      title: string;
      message: string;
      styles: {
        color: string;
        bgColor: string;
      };
    };
    properties?: string[];
    tickets?: {
      emailId: string;
      message: string;
      property: string;
      status: TicketStatus;
    }[];
  };
}

export interface TicketManagement {
  _id: string;
  user: { id: string };
  widget: {
    type: {
      id: string;
      name: WidgetType;
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
    tickets: {
      emailId: string;
      message: string;
      property: string;
      status: TicketStatus;
    }[];
  };
}

export interface TicketManagementListResponse extends APIResponse {
  data: TicketManagement[];
}
