import {ArrayUnique, IsArray, IsEnum, IsInt, IsOptional} from 'class-validator';
import {Level, Location, TrainingType, UserRole} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';


export class UsersQuery {
  @ApiProperty({
    description: 'Номер текущей страницы',
    example: 1,
    required: false,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  @Transform(({value}) => parseInt(value))
  page = 0;

  @ApiProperty({
    description: 'Уровень пользователя',
    example: Level.Beginner,
    enum: Level,
    required: false,
  })
  @IsEnum(Level)
  @IsOptional()
  level?: Level;

  @ApiProperty({
    description: 'Тип тренировки',
    enum: TrainingType,
    isArray: true,
    example: [TrainingType.Yoga, TrainingType.Pilates],
    required: false,
  })
  @IsEnum(TrainingType, {each: true})
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  trainingTypes?: TrainingType[];

  @ApiProperty({
    description: 'Локация',
    enum: Location,
    isArray: true,
    example: [Location.Petrogradsraya, Location.Sportivnaya],
    required: false,
  })
  @IsEnum(Location, {each: true})
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  locations?: Location[];

  @ApiProperty({
    description: 'Сортировка по типу пользователя',
    enum: UserRole,
    example: UserRole.Coach,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  sortBy?: UserRole;
}
