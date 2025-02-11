import { APIResponse } from '../common.interface';

export interface Subscriber {
  emailId: string;
  property: string;
  subscribedAt: string;
}

export interface SubscriberListResponse extends APIResponse {
  data: { _id: string; subscriber: Subscriber }[];
}
