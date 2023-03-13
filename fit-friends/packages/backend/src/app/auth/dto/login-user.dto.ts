import {LoginData} from '@fit-friends/shared-types';
import {IsEmail, IsString, Length} from 'class-validator';
import {UserPassword} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';

export class LoginUserDTO implements LoginData {
  @ApiProperty({
    description: 'Адрес электронной почты, используется в качестве имени пользователя (логин)',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    minLength: UserPassword.MinLength,
    maxLength: UserPassword.MaxLength,
  })
  @Length(UserPassword.MinLength, UserPassword.MaxLength)
  @IsString()
  password: string;
}
