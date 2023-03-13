import {ApiProperty, PartialType} from '@nestjs/swagger';
import {CreateTrainingDTO} from './create-training.dto';
import {IsBoolean, IsOptional} from 'class-validator';


export class UpdateTrainingDto extends PartialType(CreateTrainingDTO) {
  @ApiProperty({
    description: 'Маркер специального предложения',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isSpecialOffer?: boolean;
}
