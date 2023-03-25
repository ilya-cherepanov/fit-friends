import {ListResponse, TrainingResponse} from '@fit-friends/shared-types';
import {ApiProperty} from '@nestjs/swagger';
import {Expose, Type} from 'class-transformer';
import {TrainingRDO} from './training.rdo';

export class TrainingListRDO implements ListResponse<TrainingResponse> {
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
    description: 'Список пользователей',
    type: TrainingRDO,
    isArray: true,
  })
  @Type(() => TrainingRDO)
  @Expose()
  items: TrainingRDO[];
}
