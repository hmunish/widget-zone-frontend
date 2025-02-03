import { Gender } from './common.enums';

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  emailId: string;
  password: string;
}

export interface SignInPayload {
  emailId: string;
  password: string;
}
