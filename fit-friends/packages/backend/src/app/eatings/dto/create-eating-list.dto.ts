import {CreateEatingDTO} from './create-eating.dto';
import {ValidateNested} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {CreateEatingListRequest} from '@fit-friends/shared-types';


export class CreateEatingListDTO implements CreateEatingListRequest {
  @ApiProperty({
    description: 'Данные о приеме пищи',
    type: [CreateEatingDTO],
  })
  @ValidateNested({each: true})
  @Type(() => CreateEatingDTO)
  items: CreateEatingDTO[];
}
