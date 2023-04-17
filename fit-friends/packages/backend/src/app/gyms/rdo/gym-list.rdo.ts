import {GymResponse, ListResponse} from '@fit-friends/shared-types';
import {GymRDO} from './gym.rdo';
import {Expose, Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';


export class GymListRdo implements ListResponse<GymResponse> {
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
    description: 'Список спортивных залов',
    type: [GymRDO],
  })
  @Expose()
  @Type(() => GymRDO)
  items: GymRDO[];
}
