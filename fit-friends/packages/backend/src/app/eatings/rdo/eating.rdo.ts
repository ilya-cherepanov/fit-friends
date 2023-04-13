import {Expose} from 'class-transformer';
import {EatingType} from '@fit-friends/core';


export class EatingRDO {
  @Expose()
  type: EatingType

  @Expose()
  calories: number;

  @Expose()
  createAt: string;
}
