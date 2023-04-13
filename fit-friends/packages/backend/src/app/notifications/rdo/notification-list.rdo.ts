import {ListResponse, NotificationResponse} from '@fit-friends/shared-types';
import {NotificationRDO} from './notification.rdo';
import {Expose, Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';


export class NotificationListRDO implements ListResponse<NotificationResponse> {
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
    description: 'Список уведомлений',
    type: [NotificationRDO],
  })
  @Type(() => NotificationRDO)
  @Expose()
  items: NotificationRDO[];
}
