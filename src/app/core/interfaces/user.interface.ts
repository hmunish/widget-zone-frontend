import { Gender } from './common.enums';
import { APIResponse } from './common.interface';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: Gender;
  emailId?: string;
  mobileNumber?: string;
}

export interface GetUserProfileResponse extends APIResponse {
  user: User;
}
