import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards
} from '@nestjs/common';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {fillObject} from '@fit-friends/core';
import {NotificationListRDO} from './rdo/notification-list.rdo';
import {NotificationsService} from './notifications.service';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation, ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';


@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить уведомления пользователя',
  })
  @ApiQuery({
    name: 'page',
    description: 'Номер текущей страницы',
    example: 10,
    required: false,
  })
  @ApiOkResponse({
    description: 'Возвращает уведомления пользователя',
    type: NotificationListRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован'
  })
  async getMany(
    @User() user: JWTPayload,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number
  ) {
    return fillObject(
      NotificationListRDO,
      await this.notificationsService.getMany(user.sub, page)
    );
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить уведомление',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор уведомления',
    example: 10,
  })
  @ApiNoContentResponse({
    description: 'Уведомление удаленно',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован'
  })
  async delete(@User() user: JWTPayload, @Param('id', ParseIntPipe) notificationId: number) {
    await this.notificationsService.delete(notificationId, user.sub);
  }
}
