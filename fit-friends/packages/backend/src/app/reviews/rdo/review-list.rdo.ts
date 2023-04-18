import {ListResponse, ReviewResponse} from '@fit-friends/shared-types';
import {ReviewRDO} from './review.rdo';
import {Expose, Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';


export class ReviewListRDO implements ListResponse<ReviewResponse> {
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
    description: 'Список отзывов',
  })
  @Expose()
  @Type(() => ReviewRDO)
  items: ReviewRDO[];
}
