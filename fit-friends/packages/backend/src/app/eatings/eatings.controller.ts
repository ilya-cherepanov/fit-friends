import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {fillObject, UserRole} from '@fit-friends/core';
import {Roles} from '../auth/decorators/roles.decorator';
import {EatingsService} from './eatings.service';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {EatingRDO} from './rdo/eating.rdo';
import {CreateEatingListDTO} from './dto/create-eating-list.dto';
import {
  ApiBearerAuth, ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {EatingsRDO} from './rdo/eatings.rdo';
import {GetEatingsDTO} from './dto/get-eatings.dto';


@Controller('eatings')
@ApiTags('Eatings')
export class EatingsController {
  constructor(private readonly eatingsService: EatingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Сохранить изменения в дневнике питания',
  })
  @ApiOkResponse({
    description: 'Изменения в дневнике питания сохранены',
    type: [EatingRDO],
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async save(@Body() dto: CreateEatingListDTO, @User() user: JWTPayload) {
    return fillObject(EatingRDO, await this.eatingsService.save(user.sub, dto));
  }

  @Get()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить записи дневника питания',
  })
  @ApiQuery({
    name: 'page',
    description: 'Номер страницы',
    required: false,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Возвращает записи дневника питания за указанный период',
    type: EatingsRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async get(
    @User() user: JWTPayload,
    @Body() dto: GetEatingsDTO,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return fillObject(EatingsRDO, await this.eatingsService.getMany(user.sub, dto, page));
  }
}
