import {CreateEatingDTO} from './create-eating.dto';
import {ValidateNested} from 'class-validator';


export class CreateEatingListDTO {
  @ValidateNested()
  items: CreateEatingDTO[];
}
