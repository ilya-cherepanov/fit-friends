import {OrderItemResponse} from '@fit-friends/shared-types';
import {TrainingRDO} from '../../trainings/rdo/training.rdo';
import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';


export class OrderItemRDO extends TrainingRDO implements OrderItemResponse {
  @ApiProperty({
    description: 'Количество купленных тренеровок',
    example: 6,
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'Сумма покупки',
    example: 6000,
  })
  @Expose()
  sum: number;
}
