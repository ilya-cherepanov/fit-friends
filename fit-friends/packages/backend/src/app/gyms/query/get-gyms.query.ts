import {ArrayUnique, IsArray, IsBoolean, IsEnum, IsInt, IsOptional, Max, Min} from 'class-validator';
import {GymParameters, GymPrice, Location} from '@fit-friends/core';
import {Transform} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';


export class GetGymsQuery {
  @ApiProperty({
    description: 'Номер текущей страницы',
    example: 1,
    required: false,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  @Transform(({value}) => parseInt(value) || 0)
  page = 0;

  @ApiProperty({
    description: 'Минимальная цена',
    maximum: GymPrice.Max,
    minimum: GymPrice.Min,
    example: 500,
    required: false,
  })
  @Max(GymPrice.Max)
  @Min(GymPrice.Min)
  @IsInt()
  @IsOptional()
  @Transform(({value}) => parseInt(value))
  minPrice?: number;

  @ApiProperty({
    description: 'Максимальная цена',
    maximum: GymPrice.Max,
    minimum: GymPrice.Min,
    example: 1000,
    required: false,
  })
  @Max(GymPrice.Max)
  @Min(GymPrice.Min)
  @IsInt()
  @IsOptional()
  @Transform(({value}) => parseInt(value))
  maxPrice?: number;

  @ApiProperty({
    description: 'Локация',
    enum: Location,
    isArray: true,
    example: [Location.Petrogradsraya, Location.Sportivnaya],
    required: false,
  })
  @IsEnum(Location, {each: true})
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  location?: Location[];

  @ApiProperty({
    description: 'Дополнительные параметры зала',
    enum: GymParameters,
    isArray: true,
    example: [GymParameters.Massage, GymParameters.Pool],
    required: false,
  })
  @IsEnum(GymParameters, {each: true})
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  parameters?: GymParameters[];

  @ApiProperty({
    description: 'Только проверенные залы',
    type: Boolean,
    example: true,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({value}) => value.toLowerCase() === 'true')
  isVerified?: boolean;
}
