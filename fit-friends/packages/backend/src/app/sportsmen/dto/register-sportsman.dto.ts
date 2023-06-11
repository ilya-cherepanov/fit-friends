import {RegisterUserDTO} from '../../users/dto/register-user.dto';
import {SportsmanRegisterData} from '@fit-friends/shared-types';
import {
  SportsmanDescription,
  SportsmanLoseCalories,
  SportsmanLoseCaloriesPerDay,
  TrainingTimeIntervals
} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {IsEnum, IsInt, IsOptional, IsString, Length, Max, Min} from 'class-validator';
import {Transform} from 'class-transformer';


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
  @Transform(({value}) => parseInt(value))
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
  @Transform(({value}) => parseInt(value))
  caloriesToLose: number;

  @ApiProperty({
    description: 'Готовность к тренировке',
    example: true,
  })
  @IsEnum(TrainingTimeIntervals)
  trainingDuration: TrainingTimeIntervals;

  @ApiProperty({
    description: 'Описание пользователя',
    example: 'Персональный тренер и инструктор групповых программ с опытом  более 4х лет. Специализация: коррекция фигуры и осанки, снижение веса, восстановление после травм, пилатес.',
    minLength: SportsmanDescription.MinLength,
    maxLength: SportsmanDescription.MaxLength,
  })
  @Length(SportsmanDescription.MinLength, SportsmanDescription.MaxLength)
  @IsString()
  @IsOptional()
  description?: string;
}
