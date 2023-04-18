import {Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseGuards} from '@nestjs/common';
import {ReviewsService} from './reviews.service';
import {fillObject, UserRole} from '@fit-friends/core';
import {ReviewRDO} from './rdo/review.rdo';
import {JWTPayload} from '@fit-friends/shared-types';
import {User} from '../auth/decorators/user.decorator';
import {CreateReviewDTO} from './dto/create-review.dto';
import {Roles} from '../auth/decorators/roles.decorator';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {ReviewListRDO} from './rdo/review-list.rdo';


@Controller()
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать отзыв',
  })
  @ApiCreatedResponse({
    description: 'Создан отзыв',
    type: [ReviewRDO],
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  @ApiBadRequestResponse({
    description: 'Невалидный запрос',
  })
  @ApiNotFoundResponse({
    description: 'Не найдена тренировка с данным id',
  })
  async create(@User() user: JWTPayload, @Body() dto: CreateReviewDTO) {
    return fillObject(
      ReviewRDO,
      await this.reviewsService.create(user.sub, dto)
    );
  }

  @Get('trainings/:trainingId/reviews')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить отзывы',
  })
  @ApiParam({
    name: 'trainingId',
    description: 'Идентификатор тренировки',
    example: 15,
  })
  @ApiQuery({
    name: 'page',
    description: 'Номер страницы',
    required: false,
  })
  @ApiOkResponse({
    description: 'Возвращает список отзывов',
    type: ReviewListRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован'
  })
  @ApiBadRequestResponse({
    description: 'Невалидный запрос',
  })
  @ApiNotFoundResponse({
    description: 'Не найдена тренировка с данным id',
  })
  async getMany(
    @Param('trainingId', ParseIntPipe) trainingId: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return fillObject(
      ReviewListRDO,
      await this.reviewsService.getMany(trainingId, page)
    );
  }
}
