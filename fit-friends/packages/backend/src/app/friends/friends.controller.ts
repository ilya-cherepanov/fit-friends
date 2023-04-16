import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation, ApiParam, ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UserListRDO} from '../users/rdo/user-list.rdo';
import {fillObject, UserRole} from '@fit-friends/core';
import {FriendsQuery} from '../users/query/friends.query';
import {Roles} from '../auth/decorators/roles.decorator';
import {RolesGuard} from '../auth/guards/roles.guard';
import {FriendsService} from './friends.service';
import {FriendRDO} from './rdo/friend.rdo';


@Controller('friends')
@ApiTags('Friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post(':id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Добавить в друзья',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя, к которому адресовано предложени дружбы',
    example: 134,
  })
  @ApiCreatedResponse({
    description: 'Добавляет другого пользователя в друзья',
  })
  @ApiBadRequestResponse({
    description: 'Неверный запрос',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async create(@Param('id', ParseIntPipe) friendId: number, @User() user: JWTPayload) {
    return fillObject(FriendRDO, await this.friendsService.create(user.sub, friendId));
  }

  @Post(':id/confirm')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Подтвердить предложение дружбы',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользовател предложившего дружбу',
    example: 134,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async confirm(@Param('id', ParseIntPipe) friendId: number, @User() user: JWTPayload) {
    return fillObject(FriendRDO, await this.friendsService.accept(user.sub, friendId));
  }

  @Post(':id/reject')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Отклонить предложение дружбы',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя предложившего дружбу',
    example: 134,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async reject(@Param('id', ParseIntPipe) friendId: number, @User() user: JWTPayload) {
    await this.friendsService.reject(user.sub, friendId);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @Roles(UserRole.Sportsman)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Прекратить дружбу'
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя, c которым нужно разорвать дружбу',
    example: 134,
  })
  @ApiNoContentResponse({
    description: 'Дружба разорвана',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async delete(@Param('id', ParseIntPipe) friendId: number, @User() user: JWTPayload) {
    await this.friendsService.delete(user.sub, friendId);
  }

  @Get('')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить список друзей',
  })
  @ApiOkResponse({
    description: 'Возвращает список друзей пользователя',
    type: UserListRDO,
  })
  @ApiBadRequestResponse({
    description: 'Неверный запрос',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async getMany(@User() user: JWTPayload, @Query() query: FriendsQuery) {
    return fillObject(UserListRDO, await this.friendsService.getMany(user.sub, query));
  }
}
