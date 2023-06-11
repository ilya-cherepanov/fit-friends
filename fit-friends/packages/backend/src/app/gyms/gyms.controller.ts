import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {GymsService} from './gyms.service';
import {JWTPayload} from '@fit-friends/shared-types';
import {User} from '../auth/decorators/user.decorator';
import {Roles} from '../auth/decorators/roles.decorator';
import {fillObject, UserRole} from '@fit-friends/core';
import {RolesGuard} from '../auth/guards/roles.guard';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags} from '@nestjs/swagger';
import {GymListRdo} from './rdo/gym-list.rdo';
import {GetGymsQuery} from './query/get-gyms.query';
import {GymRDO} from './rdo/gym.rdo';


@Controller('gyms')
@ApiTags('Gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get('favorites')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить понравившиеся спортивные залы',
  })
  @ApiOkResponse({
    description: 'Возвращает список спортивных залов',
  })
  async getFavorites(
    @User() user: JWTPayload,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number
  ) {
    return fillObject(GymListRdo, await this.gymsService.getFavorites(user.sub, page));
  }

  @Get('')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить список спортивных залов',
  })
  async getMany(@User() user: JWTPayload, @Query() query: GetGymsQuery) {
    return fillObject(GymListRdo, await this.gymsService.getMany(query, user.sub));
  }

  @Get(':gymId([0-9]+)')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить спортивный зал',
  })
  @ApiParam({
    name: 'gymId',
    description: 'Идентификатор спортивного зала',
    type: Number,
    example: 33,
  })
  async getOne(@Param('gymId', ParseIntPipe) gymId: number, @User() sportsman: JWTPayload) {
    return fillObject(GymRDO, await this.gymsService.getOne(gymId, sportsman.sub));
  }

  @Post(':id/favorites/:state')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Установить статус фаворита',
  })
  @ApiNoContentResponse({
    description: 'Установлен статус(true/false) фаворита',
  })
  @ApiParam({
    name: 'state',
    description: 'Статус(true/false) фаворита',
    type: Boolean,
    example: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор спортивного зала',
    type: Number,
    example: 33,
  })
  async setFavoriteState(
    @User() user: JWTPayload,
    @Param('id', ParseIntPipe) id: number,
    @Param('state', ParseBoolPipe) state: boolean,
  ) {
    await this.gymsService.setFavorite(user.sub, id, state);
  }
}
