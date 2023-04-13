import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
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
  async getMany(@User() user: JWTPayload, query: GetBalanceQuery) {
    return fillObject(BalanceListRDO, await this.balanceService.getMany(user.sub, query));
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  async change(@User() user: JWTPayload, @Body() dto: ChangeBalanceDTO) {
    return fillObject(BalanceItemRDO, await this.balanceService.change(user.sub, dto));
  }
}
