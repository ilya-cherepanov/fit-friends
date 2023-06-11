import {Expose} from 'class-transformer';
import {GymParameters, Location} from '@fit-friends/core';
import {GymResponse} from '@fit-friends/shared-types';
import {ApiProperty} from '@nestjs/swagger';


export class GymRDO implements GymResponse {
  @ApiProperty({
    description: 'Идентификатор зала',
    example: 10,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Название зала',
    example: 'Grand Fitness',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Месторасположеине зала',
    enum: Location,
    example: Location.Zvezdnaya,
  })
  @Expose()
  location: Location;

  @ApiProperty({
    description: 'Признак, что зал проверен',
    example: true,
  })
  @Expose()
  isVerified: boolean;

  @ApiProperty({
    description: 'Дополнительные опции зала',
    enum: GymParameters,
    isArray: true,
    example: [GymParameters.Pool, GymParameters.Massage],
  })
  @Expose()
  parameters: GymParameters[];

  @ApiProperty({
    description: 'Фотографии зала',
    example: [
      '13f38369-00fc-4ff6-8134-1457e390624e.jpg',
      '37f7e795-51ac-4e95-928a-878e3533f54c.jpg',
      '60ec83a2-4894-4a41-bd5c-6c7d605c587e.jpg',
    ],
  })
  @Expose()
  photos: string[];

  @ApiProperty({
    description: 'Описание зала',
    example: 'Спортивный комплекс премиум-класса с 3 видами сауны, бассейном длинной 54 м., услугами массажиста и большой парковкой.',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Цена занятия в зале',
    example: 200,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Дата регистрации зала',
    example: '2023-04-09T20:59:26.320Z',
  })
  @Expose()
  createdAt: string;

  @ApiProperty({
    description: 'Является ли зал фаворитом пользователя',
    example: '2023-04-09T20:59:26.320Z',
  })
  @Expose()
  isFavorite: boolean;
}
