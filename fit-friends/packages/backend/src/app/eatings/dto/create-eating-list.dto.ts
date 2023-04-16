import {CreateEatingDTO} from './create-eating.dto';
import {ValidateNested} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';


export class CreateEatingListDTO {
  @ApiProperty({
    description: 'Данные о приеме пищи',
    type: [CreateEatingDTO],
  })
  @ValidateNested({each: true})
  @Type(() => CreateEatingDTO)
  items: CreateEatingDTO[];
}
