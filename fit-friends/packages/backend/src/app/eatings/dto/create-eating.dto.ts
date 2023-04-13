import {IsDate, IsEnum, IsInt, Min} from 'class-validator';
import {EatingType} from '@fit-friends/core';


export class CreateEatingDTO {
  @Min(0)
  @IsInt()
  calories: number;

  @IsDate()
  createdAt: Date;

  @IsEnum(EatingType)
  type: EatingType;
}
