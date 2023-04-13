import {Expose, Type} from 'class-transformer';
import {OrderType} from '@fit-friends/core';
import {TrainingRDO} from '../../trainings/rdo/training.rdo';
import {GymRDO} from '../../gyms/rdo/gym.rdo';
import {ApiProperty} from '@nestjs/swagger';

export class BalanceItemRDO {
  @ApiProperty({
    description: 'Идентификатор записи баланса пользователя',
    example: 10,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 22,
  })
  @Expose()
  userId: number;

  @ApiProperty({
    description: 'Тип записи баланаса пользователя',
    type: OrderType,
    example: OrderType.Training
  })
  @Expose()
  type: OrderType;

  @ApiProperty({
    description: 'Тренеровка к которой привязан баланс',
    type: TrainingRDO,
    required: false,
  })
  @Type(() => TrainingRDO)
  @Expose()
  training: TrainingRDO;

  @ApiProperty({
    description: 'Спортивный зал к которой привязан баланс',
    type: GymRDO,
    required: false,
  })
  @Type(() => GymRDO)
  @Expose()
  gym: GymRDO;
}
