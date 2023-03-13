import {CoachResponse, TrainingResponse} from '@fit-friends/shared-types';
import {
  Level, MIN_PRICE,
  TrainingCalories,
  TrainingDescription,
  TrainingTimeIntervals,
  TrainingTitle,
  TrainingType,
  UserSex
} from '@fit-friends/core';
import {CoachRDO} from '../../users/rdo/user.rdo';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';


export class TrainingRDO implements TrainingResponse {
  @ApiProperty({
    description: 'Идентификатор тренировки',
    example: 143,
  })
  id: number;

  @ApiProperty({
    description: 'Количество калорий',
    minimum: TrainingCalories.Min,
    maximum: TrainingCalories.Max,
    example: 2000,
  })
  calories: number;

  @ApiProperty({
    description: 'Тренер проводящий тренеровку',
    type: CoachRDO,
  })
  @Type(() => CoachRDO)
  coach: CoachRDO;

  @ApiProperty({
    description: 'Описание тренировки',
    example: 'Сложный комплекс упражнений для профессиональных атлетов на отработку показателей в классическом стиле.',
    minLength: TrainingDescription.MinLength,
    maxLength: TrainingDescription.MaxLength,
  })
  description: string;

  @ApiProperty({
    description: 'Время тренировки',
    enum: TrainingTimeIntervals,
    example: TrainingTimeIntervals.EightyToOneHundred,
  })
  duration: TrainingTimeIntervals;

  @ApiProperty({
    description: 'Фоновое изображение',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Маркер специального предложения',
    example: false,
    required: false,
  })
  isSpecialOffer: boolean;

  @ApiProperty({
    description: 'Требуемый уровень подготовки',
    enum: Level,
    example: Level.Amateur,
  })
  level: Level;

  @ApiProperty({
    description: 'Цена тренировки',
    example: 1200,
    minimum: MIN_PRICE,
  })
  price: number;

  @ApiProperty({
    description: 'Рейтинг тренировки',
    example: 3.5,
  })
  rating: number;

  @ApiProperty({
    description: 'Пол пользователя для которого предназначена тренировка',
    enum: UserSex,
    example: UserSex.Any,
  })
  sex: UserSex;

  @ApiProperty({
    description: 'Название тренировки',
    minLength: TrainingTitle.MinLength,
    maxLength: TrainingTitle.MaxLength,
    example: 'Crossfit',
  })
  title: string;

  @ApiProperty({
    description: 'Тип тренировки',
    enum: TrainingType,
    example: TrainingType.Crossfit,
  })
  type: TrainingType;

  @ApiProperty({
    description: 'Видео тренировки',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.mp4',
  })
  video: string;
}
