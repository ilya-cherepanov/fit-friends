import {RegisterUserDTO} from '../../users/dto/register-user.dto';
import {CoachRegisterData} from '@fit-friends/shared-types';
import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsString, Length} from 'class-validator';
import {CoachAccomplishments} from '@fit-friends/core';


export class RegisterCoachDTO extends RegisterUserDTO implements CoachRegisterData {
  @ApiProperty({
    description: 'Достижения тренера',
    example: 'Персональный тренер и инструктор групповых программ с опытом  более 4х лет. Специализация: коррекция фигуры и осанки, снижение веса, восстановление после травм, пилатес.',
    required: false,
    minLength: CoachAccomplishments.MinLength,
    maxLength: CoachAccomplishments.MaxLength,
  })
  @Length(CoachAccomplishments.MinLength, CoachAccomplishments.MaxLength)
  @IsString()
  achievements: string;

  @ApiProperty({
    description: 'Флаг готовности проводить персональные тренеровки',
    example: true,
    required: false,
  })
  @IsBoolean()
  hasPersonalTraining: boolean;

  @ApiProperty({
    description: 'Файл с сертификатом',
    type: 'string',
    format: 'binary',
  })
  certificate: unknown;
}
