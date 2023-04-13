import {Balance} from '../../types/balance';
import {OrderType} from '@fit-friends/core';
import {ConflictException} from '@nestjs/common';


export class BalanceEntity implements Balance {
  id?: number;
  userId: number;
  remains: number;
  type: OrderType;
  trainingId?: number;
  gymId?: number;

  constructor(balance: Balance) {
    this.fillEntity(balance);
  }

  fillEntity(balance: Balance) {
    this.userId = balance.userId;
    this.remains = balance.remains;
    this.type = balance.type;

    if (balance.id) {
      this.id = balance.id;
    }

    if (balance.type === OrderType.Training) {
      if (!balance.trainingId) {
        throw new ConflictException();
      }

      this.trainingId = balance.trainingId;
    }

    if (balance.type === OrderType.Subscription) {
      if (!balance.gymId) {
        throw new ConflictException();
      }

      this.gymId = balance.gymId;
    }
  }

  increment(count = 1) {
    this.remains += count;
  }

  decrement(count = 1) {
    const result = this.remains - count;
    this.remains = result >= 0 ? result : 0;
  }
}
