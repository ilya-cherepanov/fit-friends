import {RegisterUserDTO} from '../../users/dto/register-user.dto';
import {SportsmanRegisterData} from '@fit-friends/shared-types';
import {SportsmanLoseCalories, SportsmanLoseCaloriesPerDay, TrainingTimeIntervals} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {IsEnum, IsInt, Max, Min} from 'class-validator';


export class RegisterSportsmanDTO extends RegisterUserDTO implements SportsmanRegisterData {
  @ApiProperty({
    description: 'Количество калорий для траты в день',
    example: 1200,
    minimum: SportsmanLoseCaloriesPerDay.Min,
    maximum: SportsmanLoseCaloriesPerDay.Max,
  })
  @Max(SportsmanLoseCaloriesPerDay.Max)
  @Min(SportsmanLoseCaloriesPerDay.Min)
  @IsInt()
  caloriesPerDay: number;

  @ApiProperty({
    description: 'Количество калорий для сброса',
    example: 1200,
    minimum: SportsmanLoseCalories.Min,
    maximum: SportsmanLoseCalories.Max,
  })
  @Max(SportsmanLoseCalories.Max)
  @Min(SportsmanLoseCalories.Min)
  @IsInt()
  caloriesToLose: number;

  @ApiProperty({
    description: 'Готовность к тренировке',
    example: true,
  })
  @IsEnum(TrainingTimeIntervals)
  trainingDuration: TrainingTimeIntervals;
}
