import {EatingType} from '@fit-friends/core';


export interface EatingResponse {
  id: number;
  type: EatingType;
  calories: number;
  createdAt: string;
}
