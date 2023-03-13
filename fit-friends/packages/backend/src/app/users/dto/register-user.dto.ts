import {BaseRegisterData} from '@fit-friends/shared-types';
import {
  Level,
  Location,
  TrainingType,
  USER_MAX_TRAINING_TYPE_COUNT,
  UserName,
  UserPassword,
  UserRole,
  UserSex
} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {ArrayUnique, IsDateString, IsEmail, IsEnum, IsString, Length, MaxLength} from 'class-validator';

export abstract class RegisterUserDTO implements BaseRegisterData {
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Уровень подготовки/квалификации пользователя',
    enum: Level,
    example: Level.Professional,
  })
  @IsEnum(Level)
  level: Level;

  @ApiProperty({
    description: 'Станция метро где находится пользователь',
    enum: Location,
    example: Location.Petrogradsraya,
  })
  @IsEnum(Location)
  location: Location;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Валера',
    minLength: UserName.MinLength,
    maxLength: UserName.MaxLength,
  })
  @Length(UserName.MinLength, UserName.MaxLength)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Дата рождения пользователя',
    example: '2002-03-10',
    required: false,
  })
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password1234',
    minLength: UserPassword.MinLength,
    maxLength: UserPassword.MaxLength,
  })
  @Length(UserPassword.MinLength, UserPassword.MaxLength)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Тип пользоавтеля',
    enum: UserRole,
    example: UserRole.Sportsman
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'Пол пользователя',
    enum: UserSex,
    example: UserSex.Any,
  })
  @IsEnum(UserSex)
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
    maxLength: USER_MAX_TRAINING_TYPE_COUNT,
  })
  @MaxLength(USER_MAX_TRAINING_TYPE_COUNT)
  @ArrayUnique()
  @IsEnum(TrainingType, {each: true})
  trainingTypes: TrainingType[];

  @ApiProperty({
    description: 'Файл с сертификатом',
    type: 'string',
    format: 'binary',
    required: false,
  })
  avatar?: unknown;
}
