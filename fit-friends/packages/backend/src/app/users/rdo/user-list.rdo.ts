import {UserListResponse} from '@fit-friends/shared-types';
import {BaseUserRDO, CoachRDO, SportsmanRDO} from './user.rdo';
import {Type} from 'class-transformer';
import {UserRole} from '@fit-friends/core';
import {ApiProperty, getSchemaPath} from '@nestjs/swagger';


export class UserListRDO implements UserListResponse {
  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Список пользователей',
    type: 'array',
    items: {
      anyOf: [
        {$ref: getSchemaPath(CoachRDO)},
        {$ref: getSchemaPath(SportsmanRDO)},
      ]
    },
  })
  @Type(() => BaseUserRDO, {
    discriminator: {
      property: 'role',
      subTypes: [
        {value: CoachRDO, name: UserRole.Coach},
        {value: SportsmanRDO, name: UserRole.Sportsman},
      ],
    },
  })
  users: (SportsmanRDO | CoachRDO)[];
}
