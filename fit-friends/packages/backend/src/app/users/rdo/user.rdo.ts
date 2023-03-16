import {BaseUserResponse, CoachResponse, SportsmanResponse} from '@fit-friends/shared-types';
import {Level, Location, UserRole, UserSex, TrainingTimeIntervals, TrainingType} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';

export class BaseUserRDO implements BaseUserResponse {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 10,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Аватар пользователя',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.jpg',
  })
  @Expose()
  avatar: string;

  @ApiProperty({
    description: 'Дата рождения пользователя',
    example: '2002-03-10',
  })
  @Expose()
  birthDate: string;

  @ApiProperty({
    description: 'Дата регистрации пользователя',
    example: '2023-03-10T15:18:29.847Z',
  })
  @Expose()
  createdAt: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@mail.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Уровень подготовки/квалификации пользователя',
    enum: Level,
    example: Level.Professional,
  })
  @Expose()
  level: Level;

  @ApiProperty({
    description: 'Станция метро где находится пользователь',
    enum: Location,
    example: Location.Petrogradsraya,
  })
  @Expose()
  location: Location;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Валера',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Тип пользоавтеля',
    enum: UserRole,
    example: UserRole.Sportsman
  })
  @Expose()
  role: UserRole;

  @ApiProperty({
    description: 'Пол пользователя',
    enum: UserSex,
    example: UserSex.Any,
  })
  @Expose()
  sex: UserSex;

  @ApiProperty({
    description: 'Тип тренировок',
    enum: TrainingType,
    isArray: true,
    example: [
      TrainingType.Pilates,
      TrainingType.Yoga,
      TrainingType.Stretching
    ],
  })
  @Expose()
  trainingTypes: TrainingType[];
}

export class SportsmanRDO extends BaseUserRDO implements SportsmanResponse {
  @ApiProperty({
    description: 'Количество калорий для траты в день',
    example: 1200,
  })
  @Expose()
  caloriesPerDay: number;

  @ApiProperty({
    description: 'Количество калорий для сброса',
    example: 1200,
  })
  @Expose()
  caloriesToLose: number;

  @ApiProperty({
    description: 'Время на тренировку',
    enum: TrainingTimeIntervals,
    example: TrainingTimeIntervals.FiftyToEightyMinutes,
  })
  @Expose()
  trainingDuration: TrainingTimeIntervals;

  @ApiProperty({
    description: 'Готовность к тренировке',
    example: true,
  })
  @Expose()
  readyToTraining: boolean;
}

export class CoachRDO extends BaseUserRDO implements CoachResponse {
  @ApiProperty({
    description: 'Сертификат тренера',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.pdf',
  })
  @Expose()
  certificate: string;

  @ApiProperty({
    description: 'Достижения тренера',
    example: 'Персональный тренер и инструктор групповых программ с опытом  более 4х лет. Специализация: коррекция фигуры и осанки, снижение веса, восстановление после травм, пилатес.',
  })
  @Expose()
  achievements: string;

  @ApiProperty({
    description: 'Флаг готовности проводить персональные тренеровки',
    example: true,
  })
  @Expose()
  hasPersonalTrainings: boolean;
}
