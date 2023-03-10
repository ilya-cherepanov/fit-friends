import {BaseUserResponse, CoachResponse, SportsmanResponse} from '@fit-friends/shared-types';
import {Level, Location, UserRole, UserSex, TrainingTimeIntervals, TrainingType} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';

class BaseUserRDO implements BaseUserResponse {
  @ApiProperty({
    description: '',
    example: 10,
  })
  id: number;
  @ApiProperty({
    description: '',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.jpg',
  })
  avatar: string;

  @ApiProperty({
    description: '',
    example: '2002-03-10',
  })
  birthDate: string;

  @ApiProperty({
    description: '',
    example: '2023-03-10T15:18:29.847Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '',
    example: 'user@mail.com',
  })
  email: string;

  @ApiProperty({
    description: '',
    enum: Level,
    example: Level.Professional,
  })
  level: Level;

  @ApiProperty({
    description: '',
    enum: Location,
    example: Location.Petrogradsraya,
  })
  location: Location;

  @ApiProperty({
    description: '',
    example: 'Valeara',
  })
  name: string;

  @ApiProperty({
    description: '',
    enum: UserRole,
    example: UserRole.Sportsman
  })
  role: UserRole;

  @ApiProperty({
    description: '',
    enum: UserSex,
    example: UserSex.Any,
  })
  sex: UserSex;

  @ApiProperty({
    description: '',
    enum: TrainingType,
    isArray: true,
    example: [
      TrainingType.Pilates,
      TrainingType.Yoga,
      TrainingType.Stretching
    ],
  })
  trainingTypes: TrainingType[];
}

export class SportsmanRDO extends BaseUserRDO implements SportsmanResponse {
  @ApiProperty({
    description: '',
    example: 1200,
    required: false,
  })
  caloriesPerDay: number;

  @ApiProperty({
    description: '',
    example: 1200,
    required: false,
  })
  caloriesToLose: number;

  @ApiProperty({
    description: '',
    enum: TrainingTimeIntervals,
    example: TrainingTimeIntervals.FiftyToEightyMinutes,
  })
  trainingDuration: TrainingTimeIntervals;

  @ApiProperty({
    description: '',
    example: true,
  })
  readyToTraining: boolean;
}

export class CoachRDO extends BaseUserRDO implements CoachResponse {
  @ApiProperty({
    description: '',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.pdf',
    required: false,
  })
  certificate: string;

  @ApiProperty({
    description: '',
    example: '',
    required: false,
  })
  achievements: string;

  @ApiProperty({
    description: '',
    example: true,
    required: false,
  })
  hasPersonalTraining: boolean;
}
