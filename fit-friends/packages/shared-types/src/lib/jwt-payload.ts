import {UserRole} from '@fit-friends/core';


export interface JWTPayload {
  sub: number;
  role: UserRole;
}
