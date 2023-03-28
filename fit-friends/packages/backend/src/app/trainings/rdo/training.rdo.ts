import {TrainingResponse} from '@fit-friends/shared-types';
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
import {Expose, Type} from 'class-transformer';


export class TrainingRDO implements TrainingResponse {
  @ApiProperty({
    description: 'Идентификатор тренировки',
    example: 143,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Количество калорий',
    minimum: TrainingCalories.Min,
    maximum: TrainingCalories.Max,
    example: 2000,
  })
  @Expose()
  calories: number;

  @ApiProperty({
    description: 'Тренер проводящий тренеровку',
    type: CoachRDO,
  })
  @Type(() => CoachRDO)
  @Expose()
  coach: CoachRDO;

  @ApiProperty({
    description: 'Описание тренировки',
    example: 'Сложный комплекс упражнений для профессиональных атлетов на отработку показателей в классическом стиле.',
    minLength: TrainingDescription.MinLength,
    maxLength: TrainingDescription.MaxLength,
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Время тренировки',
    enum: TrainingTimeIntervals,
    example: TrainingTimeIntervals.EightyToOneHundred,
  })
  @Expose()
  duration: TrainingTimeIntervals;

  @ApiProperty({
    description: 'Фоновое изображение',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.jpg',
  })
  @Expose()
  image: string;

  @ApiProperty({
    description: 'Маркер специального предложения',
    example: false,
    required: false,
  })
  @Expose()
  isSpecialOffer: boolean;

  @ApiProperty({
    description: 'Требуемый уровень подготовки',
    enum: Level,
    example: Level.Amateur,
  })
  @Expose()
  level: Level;

  @ApiProperty({
    description: 'Цена тренировки',
    example: 1200,
    minimum: MIN_PRICE,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Рейтинг тренировки',
    example: 3.5,
  })
  @Expose()
  rating: number;

  @ApiProperty({
    description: 'Пол пользователя для которого предназначена тренировка',
    enum: UserSex,
    example: UserSex.Any,
  })
  @Expose()
  sex: UserSex;

  @ApiProperty({
    description: 'Название тренировки',
    minLength: TrainingTitle.MinLength,
    maxLength: TrainingTitle.MaxLength,
    example: 'Crossfit',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Тип тренировки',
    enum: TrainingType,
    example: TrainingType.Crossfit,
  })
  @Expose()
  type: TrainingType;

  @ApiProperty({
    description: 'Видео тренировки',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.mp4',
  })
  @Expose()
  video: string;
}
