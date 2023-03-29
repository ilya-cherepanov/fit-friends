import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {LoginUserDTO} from './dto/login-user.dto';
import {fillObject} from '@fit-friends/core';
import {TokensRDO} from './rdo/tokens.rdo';
import {JWTAuthGuard} from './guards/jwt-auth.guard';
import {User} from './decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {JWTRefreshGuard} from './guards/jwt-refresh.gurard';

@Controller('auth')
@ApiTags('Auth', 'Users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Авторизация пользователя',
  })
  @ApiOkResponse({
    type: TokensRDO,
    description: 'Возвращает авторизационные токены',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь с данным email или паролем не существует'
  })
  async login(@Body() dto: LoginUserDTO) {
    return fillObject(TokensRDO, await this.authService.login(dto));
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Выход из системы',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Сбрасывает refresh token',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async logout(@User() user: JWTPayload) {
    await this.authService.logout(user.sub);
  }

  @Get('refresh')
  @UseGuards(JWTRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить пару токенов'
  })
  @ApiOkResponse({
    description: 'Возвращает новую пару токенов',
    type: TokensRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный refresh token',
  })
  @ApiForbiddenResponse({
    description: 'Неверный refresh token',
  })
  async refresh(@User() user: JWTPayload) {
    return fillObject(TokensRDO, await this.authService.refresh(user));
  }
}
