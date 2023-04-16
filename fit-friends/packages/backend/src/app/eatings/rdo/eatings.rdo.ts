import {EatingRDO} from './eating.rdo';
import {Expose, Type} from 'class-transformer';
import {EatingResponse, ListResponse} from '@fit-friends/shared-types';
import {ApiProperty} from '@nestjs/swagger';


export class EatingsRDO implements ListResponse<EatingResponse>{
  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Всего страниц',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Приемы пищи',
    type: [EatingRDO]
  })
  @Type(() => EatingRDO)
  @Expose()
  items: EatingRDO[]
}
