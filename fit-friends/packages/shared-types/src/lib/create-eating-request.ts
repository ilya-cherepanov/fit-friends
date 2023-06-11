import {EatingType} from '@fit-friends/core';


export interface CreateEatingRequest {
  calories: number;
  createdAt: Date;
  type: EatingType;
}
