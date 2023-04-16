import {OrderType} from '@fit-friends/core';
import {TrainingResponse} from './training-response';
import {GymResponse} from './gym-response';


export interface BalanceResponse {
  id: number;
  userId: number;
  type: OrderType;
  training?: TrainingResponse;
  gym?: GymResponse;
}
