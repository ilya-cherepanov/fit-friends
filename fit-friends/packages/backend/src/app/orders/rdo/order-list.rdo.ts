import {ListResponse, OrderResponse} from '@fit-friends/shared-types';
import {Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {OrderRDO} from './order.rdo';

export class OrderListRDO implements ListResponse<OrderResponse> {
  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Список заказов',
    type: [OrderRDO],
  })
  @Type(() => OrderRDO)
  items: OrderRDO[];
}
