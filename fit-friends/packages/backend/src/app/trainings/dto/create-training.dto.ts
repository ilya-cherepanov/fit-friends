import {TrainingData} from '@fit-friends/shared-types';
import {
  Level, MIN_PRICE, TrainingCalories,
  TrainingDescription,
  TrainingTimeIntervals,
  TrainingTitle,
  TrainingType,
  UserSex
} from '@fit-friends/core';
import {IsEnum, IsInt, IsString, Length, Max, Min} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';


export class CreateTrainingDTO implements TrainingData {
  @ApiProperty({
    description: 'Количество калорий',
    minimum: TrainingCalories.Min,
    maximum: TrainingCalories.Max,
    example: 2000,
  })
  @Min(TrainingCalories.Min)
  @Max(TrainingCalories.Max)
  @IsInt()
  @Transform(({value}) => parseInt(value))
  calories: number;

  @ApiProperty({
    description: 'Название тренировки',
    minLength: TrainingTitle.MinLength,
    maxLength: TrainingTitle.MaxLength,
    example: 'Crossfit',
  })
  @Length(TrainingTitle.MinLength, TrainingTitle.MaxLength)
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Описание тренировки',
    example: 'Сложный комплекс упражнений для профессиональных атлетов на отработку показателей в классическом стиле.',
    minLength: TrainingDescription.MinLength,
    maxLength: TrainingDescription.MaxLength,
  })
  @Length(TrainingDescription.MinLength, TrainingDescription.MaxLength)
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Время тренировки',
    enum: TrainingTimeIntervals,
    example: TrainingTimeIntervals.EightyToOneHundred,
  })
  @IsEnum(TrainingTimeIntervals)
  duration: TrainingTimeIntervals;

  // @ApiProperty({
  //   description: 'Требуемый уровень подготовки',
  //   enum: Level,
  //   example: Level.Amateur,
  // })
  // @IsEnum(Level)
  // level: Level;

  @ApiProperty({
    description: 'Пол пользователя для которого предназначена тренировка',
    enum: UserSex,
    example: UserSex.Any,
  })
  @IsEnum(UserSex)
  sex: UserSex;

  @ApiProperty({
    description: 'Тип тренировки',
    enum: TrainingType,
    example: TrainingType.Crossfit,
  })
  @IsEnum(TrainingType)
  type: TrainingType;

  @ApiProperty({
    description: 'Цена тренировки',
    example: 1200,
    minimum: MIN_PRICE,
  })
  @Min(MIN_PRICE)
  @IsInt()
  @Transform(({value}) => parseInt(value))
  price: number;

  @ApiProperty({
    description: 'Видео тренировки',
    type: 'string',
    format: 'binary',
  })
  video: unknown;

  // @ApiProperty({
  //   description: 'Фоновое изображение',
  //   type: 'string',
  //   format: 'binary',
  // })
  // image: unknown;
}
