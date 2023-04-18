import {IsInt, IsString, Length, Max, Min} from 'class-validator';
import {ReviewText, ReviewTrainingRating} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {ReviewRequest} from '@fit-friends/shared-types';


export class CreateReviewDTO implements ReviewRequest {
  @ApiProperty({
    description: 'Идентификатор тренировки',
    minimum: 0,
    example: 14,
  })
  @Min(0)
  @IsInt()
  trainingId: number;

  @ApiProperty({
    description: 'Текст отзыва',
    minLength: ReviewText.MinLength,
    maxLength: ReviewText.MaxLength,
    example: 'Эта тренировка для меня зарядка по утрам, помогает проснуться.',
  })
  @Length(ReviewText.MinLength, ReviewText.MaxLength)
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Оценка тренировки',
    minimum: ReviewTrainingRating.Min,
    maximum: ReviewTrainingRating.Max,
    example: 5,
  })
  @Max(ReviewTrainingRating.Max)
  @Min(ReviewTrainingRating.Min)
  @IsInt()
  rating: number;
}
