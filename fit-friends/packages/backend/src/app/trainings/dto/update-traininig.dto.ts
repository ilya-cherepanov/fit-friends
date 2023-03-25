import {ApiProperty, PartialType} from '@nestjs/swagger';
import {CreateTrainingDTO} from './create-training.dto';
import {IsBoolean, IsOptional} from 'class-validator';
import {Transform} from 'class-transformer';


export class UpdateTrainingDTO extends PartialType(CreateTrainingDTO) {
  @ApiProperty({
    description: 'Маркер специального предложения',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({value}) => 'true' === value)
  isSpecialOffer?: boolean;
}
