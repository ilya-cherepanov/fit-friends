import {GymParameters, Location} from '@fit-friends/core';


export interface GymsQuery {
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: Location[];
  parameters?: GymParameters[];
  isVerified?: boolean;
}
