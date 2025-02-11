import { TicketStatus } from '../common.enums';
import { APIResponse } from '../common.interface';

export interface Ticket {
  _id: string;
  fullName: string;
  emailId: string;
  message: string;
  property: string;
  status: TicketStatus;
}

export interface TicketListResponse extends APIResponse {
  data: { _id: string; ticket: Ticket }[];
}
