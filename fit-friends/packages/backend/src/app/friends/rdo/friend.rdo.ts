import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';
import {FriendResponse} from '@fit-friends/shared-types';


export class FriendRDO implements FriendResponse {
  @ApiProperty({
    description: 'Идентификатор',
    example: 12,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Идентификатор друга',
    example: 12,
  })
  @Expose()
  userId: number;

  @ApiProperty({
    description: 'Идентификатор друга',
    example: 12,
  })
  @Expose()
  friendId: number;
}
