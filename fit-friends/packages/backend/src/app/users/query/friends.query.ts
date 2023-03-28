import {IsInt, IsOptional} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';


export class FriendsQuery {
  @ApiProperty({
    description: 'Номер текущей страницы',
    example: 1,
    required: false,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  @Transform(({value}) => parseInt(value))
  page = 0;
}
