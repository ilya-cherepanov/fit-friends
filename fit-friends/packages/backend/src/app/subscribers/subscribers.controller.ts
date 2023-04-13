import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  UseGuards
} from '@nestjs/common';
import {SubscribersService} from './subscribers.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse, ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {JWTPayload} from '@fit-friends/shared-types';
import {Roles} from '../auth/decorators/roles.decorator';
import {fillObject, UserRole} from '@fit-friends/core';
import {User} from '../auth/decorators/user.decorator';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {SubscribingStateRDO} from './rdo/subscribing-state.rdo';


@Controller('subscribers')
@ApiTags('Subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Get()
  @ApiOperation({
    description: 'Отправить уведомления о новых тренировках',
  })
  async sendMailNotifications() {
    await this.subscribersService.sendNotifications();
  }

  @Get(':coachId')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Получить статус подписки на тренера',
  })
  @ApiParam({
    name: 'coachId',
    description: 'Идентификатор тренера',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Возвращает статус подписки',
    type: SubscribingStateRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async get(@User() user: JWTPayload, @Param('coachId', ParseIntPipe) coachId: number) {
    return fillObject(
      SubscribingStateRDO,
      await this.subscribersService.get(user.sub, coachId),
    );
  }

  @Post(':coachId/:state')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Установить статус подписки на тренера',
  })
  @ApiParam({
    name: 'coachId',
    description: 'Идентификатор тренера',
    example: 10,
  })
  @ApiParam({
    name: 'state',
    description: 'Состояние подписки',
    type: Boolean,
    example: true,
  })
  @ApiOkResponse({
    description: 'Возвращает установленный статус подписки',
    type: SubscribingStateRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async setState(
    @User() user: JWTPayload,
    @Param('coachId', ParseIntPipe) coachId: number,
    @Param('state', ParseBoolPipe) state: boolean,
  ) {
    return fillObject(
      SubscribingStateRDO,
      await this.subscribersService.setState(user.sub, coachId, state)
    );
  }
}
