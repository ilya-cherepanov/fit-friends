import {IsDate} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';


export class GetCompletedTrainingsDTO {
  @ApiProperty({
    description: 'Начало временного интервала',
    example: '',
  })
  @IsDate()
  after: Date;

  @ApiProperty({
    description: 'Конец временного интервала',
    example: '',
  })
  @IsDate()
  before: Date;
}
