import {Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards} from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {BalanceService} from './balance.service';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {GetBalanceQuery} from './query/get-balance.query';
import {Roles} from '../auth/decorators/roles.decorator';
import {fillObject, UserRole} from '@fit-friends/core';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {BalanceListRDO} from './rdo/balance-list.rdo';
import {ChangeBalanceDTO} from './dto/change-balance.dto';
import {BalanceItemRDO} from './rdo/balance-item.rdo';


@Controller('balance')
@ApiTags('Balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить баланс спортсмена',
  })
  @ApiOkResponse({
    description: 'Возвращает баланс пользователя',
    // type: BalanceListRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  @ApiBadRequestResponse({
    description: 'Неправильный запрос',
  })
  async getMany(@User() user: JWTPayload, @Query() query: GetBalanceQuery) {
    return fillObject(BalanceListRDO, await this.balanceService.getMany(user.sub, query));
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Изменить баланс спортсмена',
  })
  @ApiOkResponse({
    description: 'Изменяет запись балансва и возвращает новую',
    // type: BalanceItemRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  @ApiNotFoundResponse({
    description: 'Не найдена запись баланса',
  })
  @ApiBadRequestResponse({
    description: 'Неправильный запрос',
  })
  async change(@User() user: JWTPayload, @Body() dto: ChangeBalanceDTO) {
    return fillObject(BalanceItemRDO, await this.balanceService.change(user.sub, dto));
  }
}
