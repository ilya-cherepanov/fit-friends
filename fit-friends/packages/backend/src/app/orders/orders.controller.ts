import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import {CreateOrderDTO} from './dto/create-order.dto';
import {Roles} from '../auth/decorators/roles.decorator';
import {fillObject, UserRole} from '@fit-friends/core';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {OrdersService} from './orders.service';
import {OrderRDO} from './rdo/order.rdo';
import {GetManyOrdersQuery} from './query/get-many-orders.query';
import {OrderListRDO} from './rdo/order-list.rdo';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse, ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';


@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiCreatedResponse({
    description: 'Создает заказ',
    type: OrderRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  async create(@Body() dto: CreateOrderDTO, @User() sportsman: JWTPayload) {
    return fillObject(OrderRDO, await this.ordersService.create(dto, sportsman.sub));
  }

  @Get()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Coach)
  @ApiOkResponse({
    description: 'Возвращает оформленные заказы',
    type: OrderListRDO,
  })
  @ApiBadRequestResponse({
    description: 'Неверная строка запроса',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является тренером',
  })
  async getMany(@User() coach: JWTPayload, @Query() query: GetManyOrdersQuery) {
    return fillObject(OrderListRDO, await this.ordersService.getMany(coach.sub, query))
  }
}
