import {StatusResponse} from '@fit-friends/shared-types';
import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';


export class FriendshipStatusRDO implements StatusResponse {
  @ApiProperty({
    description: 'Статус дружбы пользователей',
    example: true,
  })
  @Expose()
  status: boolean
}
