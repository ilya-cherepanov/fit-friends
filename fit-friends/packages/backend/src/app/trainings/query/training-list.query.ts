import {ArrayUnique, IsArray, IsEnum, IsInt, IsOptional, Max, Min, ValidateIf} from 'class-validator';
import {Transform} from 'class-transformer';
import {MIN_PRICE, ReviewTrainingRating, TrainingOrderBy, TrainingTimeIntervals, TrainingType} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';


export class TrainingListQuery {
  @ApiProperty({
    description: 'Номер текущей страницы',
    example: 1,
    required: false,
    default: 0,
  })
  @Min(0)
  @IsInt()
  @Transform(({value}) => parseInt(value) || 0)
  @IsOptional()
  page = 0;

  @ApiProperty({
    description: 'Минимальная цена',
    example: 1000,
    required: false,
  })
  @Min(MIN_PRICE)
  @IsInt()
  @Transform(({value}) => parseInt(value))
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'Максимальная цена',
    example: 2000,
    required: false,
  })
  @IsInt()
  @Transform(({value}) => parseInt(value))
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: 'Минимальное количество калорий',
    example: 1000,
    required: false,
  })
  @IsInt()
  @Transform(({value}) => parseInt(value))
  @IsOptional()
  minCalories?: number;

  @ApiProperty({
    description: 'Максимальное количество калорий',
    example: 1200,
    required: false,
  })
  @IsInt()
  @Transform(({value}) => parseInt(value))
  @IsOptional()
  maxCalories?: number;

  @ApiProperty({
    description: 'Минимальный рейтинг',
    example: 4,
    minimum: ReviewTrainingRating.Min,
    maximum: ReviewTrainingRating.Max,
    required: false,
  })
  @Max(ReviewTrainingRating.Max)
  @Min(ReviewTrainingRating.Min)
  @IsInt()
  @Transform(({value}) => parseInt(value))
  @IsOptional()
  minRating?: number;

  @ApiProperty({
    description: 'Максимальный рейтинг',
    example: 5,
    minimum: ReviewTrainingRating.Min,
    maximum: ReviewTrainingRating.Max,
    required: false,
  })
  @Max(ReviewTrainingRating.Max)
  @Min(ReviewTrainingRating.Min)
  @IsInt()
  @Transform(({value}) => parseInt(value))
  @IsOptional()
  maxRating?: number;

  @ApiProperty({
    description: 'Тип тренеровок',
    example: [TrainingType.Yoga, TrainingType.Pilates],
    enum: TrainingType,
    isArray: true,
    required: false,
  })
  @IsEnum(TrainingType, {each: true})
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  types?: TrainingType[];

  @ApiProperty({
    description: 'Длительность тренеровок',
    example: TrainingTimeIntervals.EightyToOneHundred,
    enum: TrainingTimeIntervals,
    required: false,
  })
  @IsEnum(TrainingTimeIntervals)
  @IsOptional()
  duration?: TrainingTimeIntervals;

  @ApiProperty({
    description: 'Сортировка',
    example: TrainingOrderBy.Cheap,
    enum: TrainingOrderBy,
    required: false,
  })
  @IsEnum(TrainingOrderBy)
  @IsOptional()
  orderBy?: TrainingOrderBy;
}
