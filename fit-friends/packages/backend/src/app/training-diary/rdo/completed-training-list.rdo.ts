import {CompletedTrainingRDO} from './completed-training.rdo';
import {Expose, Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {CompletedTrainingResponse, ListResponse} from '@fit-friends/shared-types';


export class CompletedTrainingListRDO implements ListResponse<CompletedTrainingResponse>{
  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  @Expose()
  totalPages: number;

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 10,
  })
  @Expose()
  currentPage: number;

  @ApiProperty({
    description: 'Список законченных тренировок',
    type: [CompletedTrainingRDO],
  })
  @Type(() => CompletedTrainingRDO)
  @Expose()
  items: CompletedTrainingRDO[];
}
