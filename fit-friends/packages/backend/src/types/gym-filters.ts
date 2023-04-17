import {GymParameters, Location} from '@fit-friends/core';


export interface GymFilters {
  minPrice?: number;
  maxPrice?: number;
  locations?: Location[];
  parameters?: GymParameters[];
  isVerified?: boolean;
}
