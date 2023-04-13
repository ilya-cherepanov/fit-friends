import {Expose} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {NotificationResponse} from '@fit-friends/shared-types';


export class NotificationRDO implements NotificationResponse {
  @ApiProperty({
    description: 'Идентификатор уведомления',
    example: 10,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Текст уведомления',
    example: 'Катерина пригласила вас на тренировку',
  })
  @Expose()
  text: string;

  @ApiProperty({
    description: 'Время создания уведомления',
    example: '2023-04-12T17:38:51.653Z',
  })
  @Expose()
  createdAt: string;
}
