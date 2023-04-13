import {OrderType} from '@fit-friends/core';


export interface Balance {
  id?: number;
  userId: number;
  type: OrderType;
  remains: number;
  trainingId?: number;
  gymId?: number;
}
