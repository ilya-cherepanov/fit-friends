import {Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {JWTPayload} from '@fit-friends/shared-types';
import {User} from '../auth/decorators/user.decorator';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CoachEntity, SportsmanEntity} from './user.entity';
import {fillObject} from '@fit-friends/core';
import {CoachRDO, SportsmanRDO} from './rdo/user.rdo';
import {
  ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse, ApiOperation,
  ApiTags, ApiUnauthorizedResponse,
  getSchemaPath
} from '@nestjs/swagger';
import {UsersQuery} from './query/users.query';
import {UserListRDO} from './rdo/user-list.rdo';
import {FriendsQuery} from './query/friends.query';


@Controller('users')
@ApiTags('Users')
@ApiExtraModels(CoachRDO, SportsmanRDO)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/one/:id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить данные о пользователе',
  })
  @ApiOkResponse({
    description: 'Возвращает детальную информация о пользователе',
    schema: {
      oneOf: [
        {$ref: getSchemaPath(CoachRDO)},
        {$ref: getSchemaPath(SportsmanRDO)},
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async getById(@Param('id', ParseIntPipe) id: number) {
    const userEntity = await this.usersService.get(id);

    if (userEntity instanceof CoachEntity) {
      return fillObject(CoachRDO, userEntity);
    } else if (userEntity instanceof SportsmanEntity) {
      return fillObject(SportsmanRDO, userEntity);
    }
  }

  @Get('/all')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить список пользователей',
  })
  @ApiOkResponse({
    description: 'Возвращает список пользователей',
    type: UserListRDO,
  })
  @ApiBadRequestResponse({
    description: 'Неверный запрос',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async getAll(@Query() query: UsersQuery) {
    return fillObject(UserListRDO, await this.usersService.getAll(query));
  }

  @Post('/friends/:id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Добавить в друзья',
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
  async addFriend(@Param('id', ParseIntPipe) friendId: number, @User() user: JWTPayload) {
    await this.usersService.addFriend(friendId, user.sub);
  }

  @Get('/friends')
  @UseGuards(JWTAuthGuard)
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
  async getFriends(@User() user: JWTPayload, @Query() query: FriendsQuery) {
    return fillObject(UserListRDO, await this.usersService.getFriends(query, user.sub));
  }
}
