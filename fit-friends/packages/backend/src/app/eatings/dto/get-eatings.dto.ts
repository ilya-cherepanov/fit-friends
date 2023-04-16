import {IsDate} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {DateIntervalRequest} from '@fit-friends/shared-types';


export class GetEatingsDTO implements DateIntervalRequest {
  @ApiProperty({
    description: 'Начало временного интервала',
    example: '2023-04-16T16:05:58.770Z',
  })
  @IsDate()
  after: Date;

  @ApiProperty({
    description: 'Конец временного интервала',
    example: '2023-04-16T16:05:58.770Z',
  })
  @IsDate()
  before: Date;
}
