import {OrderType} from '@fit-friends/core';


export interface BalanceQuery {
  page?: number;
  types?: OrderType;
  isActive?: boolean;
}
