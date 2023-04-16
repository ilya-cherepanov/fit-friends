import {
  Controller, DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post, Query,
  UseGuards
} from '@nestjs/common';
import {GymsService} from './gyms.service';
import {JWTPayload} from '@fit-friends/shared-types';
import {User} from '../auth/decorators/user.decorator';
import {Roles} from '../auth/decorators/roles.decorator';
import {fillObject, UserRole} from '@fit-friends/core';
import {RolesGuard} from '../auth/guards/roles.guard';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {FavoriteGymsRDO} from './rdo/favorite-gyms.rdo';


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
    description: 'Возврващает список спортивных залов',
  })
  async getFavorites(
    @User() user: JWTPayload,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number
  ) {
    return fillObject(FavoriteGymsRDO, await this.gymsService.getFavorites(user.sub, page));
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
