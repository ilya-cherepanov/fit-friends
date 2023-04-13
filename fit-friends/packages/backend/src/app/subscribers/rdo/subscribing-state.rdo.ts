import {Expose} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';


export class SubscribingStateRDO {
  @ApiProperty({
    description: 'Статус подписчика',
    example: false,
  })
  @Expose()
  isSubscribed: boolean;
}
