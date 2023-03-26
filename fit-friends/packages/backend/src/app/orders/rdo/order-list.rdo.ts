import {ListResponse, OrderItemResponse} from '@fit-friends/shared-types';
import {Expose, Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {OrderItemRDO} from './order-item.rdo';


export class OrderListRDO implements ListResponse<OrderItemResponse> {
  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  @Expose()
  currentPage: number;

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 10,
  })
  @Expose()
  totalPages: number;

  @ApiProperty({
    description: 'Список заказов',
    type: [OrderItemRDO],
  })
  @Type(() => OrderItemRDO)
  @Expose()
  items: OrderItemRDO[];
}
