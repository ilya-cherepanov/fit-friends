import {Controller, Get, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {JWTPayload} from '@fit-friends/shared-types';
import {User} from '../auth/decorators/user.decorator';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CoachEntity, SportsmanEntity} from './user.entity';
import {fillObject} from '@fit-friends/core';
import {CoachRDO, SportsmanRDO} from './rdo/user.rdo';
import {ApiExtraModels, ApiNotFoundResponse, ApiOkResponse, ApiTags, getSchemaPath} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@ApiExtraModels(CoachRDO, SportsmanRDO)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JWTAuthGuard)
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
  async get(@User() user: JWTPayload) {
    const userEntity = await this.usersService.get(user.sub);

    if (userEntity instanceof CoachEntity) {
      return fillObject(CoachRDO, userEntity);
    } else if (userEntity instanceof SportsmanEntity) {
      return fillObject(SportsmanRDO, userEntity);
    }
  }
}
