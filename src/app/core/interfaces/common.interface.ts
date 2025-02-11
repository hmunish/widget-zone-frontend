import { HttpStatusCode } from '@angular/common/http';

export interface APIResponse {
  message: string;
  status: HttpStatusCode;
}

export interface AuthResponse {
  token?: string;
}

export type TokenPayload = {
  iat: number;
  exp: number;
  user: {
    firstName: string;
    lastName: string;
    id: string;
    emailId: string;
  };
};

export type AuthUser = {
  id: number;
  name: string;
  emailAddress: string;
};

export interface CurrentUser {
  token: string;
  emailId: string;
  id: string;
  expiration: Date;
  firstName: string;
  lastName: string;
}
