import {Controller, Get, Param, ParseIntPipe, Query, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CoachEntity, SportsmanEntity} from './user.entity';
import {fillObject} from '@fit-friends/core';
import {CoachRDO, SportsmanRDO} from './rdo/user.rdo';
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse, ApiOperation,
  ApiTags, ApiUnauthorizedResponse,
  getSchemaPath
} from '@nestjs/swagger';
import {UsersQuery} from './query/users.query';
import {UserListRDO} from './rdo/user-list.rdo';


@Controller('users')
@ApiTags('Users')
@ApiExtraModels(CoachRDO, SportsmanRDO)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id([0-9]+)')
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

  @Get('')
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
}
