import {BalanceItemRDO} from './balance-item.rdo';
import {Expose, Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';


export class BalanceListRDO {
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
    description: 'Запись баланса пользователя',
    type: [BalanceItemRDO],
  })
  @Expose()
  @Type(() => BalanceItemRDO)
  items: BalanceItemRDO[];
}
