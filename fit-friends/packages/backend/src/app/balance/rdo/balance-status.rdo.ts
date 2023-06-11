import {StatusResponse} from '@fit-friends/shared-types';
import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';


export class BalanceStatusRDO implements StatusResponse {
  @ApiProperty({
    description: 'Статус наличия тренировки на балансе пользователя',
    example: true,
  })
  @Expose()
  status: boolean
}
