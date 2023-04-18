import {SportsmanRDO} from '../../users/rdo/user.rdo';
import {ReviewResponse} from '@fit-friends/shared-types';
import {Expose, Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';


export class ReviewRDO implements ReviewResponse {
  @ApiProperty({
    description: 'Идентификатор отзыва',
    example: 15,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Текст отзыва',
    example: 'Эта тренировка для меня зарядка по утрам, помогает проснуться.',
  })
  @Expose()
  text: string;

  @ApiProperty({
    description: 'Оценка тренировки',
    example: 5,
  })
  @Expose()
  rating: number;

  @ApiProperty({
    description: 'Идентификатор тренировки',
    example: 52,
  })
  @Expose()
  trainingId: number

  @ApiProperty({
    description: 'Дата создания отзыва',
    example: '2023-04-17T22:21:12.981Z',
  })
  @Expose()
  createdAt: string;

  @ApiProperty({
    description: 'Автор отзыва',
  })
  @Expose()
  @Type(() => SportsmanRDO)
  author: SportsmanRDO;
}
