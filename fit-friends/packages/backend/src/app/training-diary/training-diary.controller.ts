import {Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards} from '@nestjs/common';
import {TrainingDiaryService} from './training-diary.service';
import {Roles} from '../auth/decorators/roles.decorator';
import {fillObject, UserRole} from '@fit-friends/core';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {GetCompletedTrainingsDTO} from './dto/get-completed-trainings.dto';
import {CompletedTrainingsQuery} from './query/completed-trainings.query';
import {CompletedTrainingListRDO} from './rdo/completed-training-list.rdo';
import {CompletedTrainingRDO} from './rdo/completed-training.rdo';
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';


@Controller('training-diary')
@ApiTags('Training', 'Training diary')
export class TrainingDiaryController {
  constructor(private readonly trainingDiaryService: TrainingDiaryService) {}

  @Post(':trainingId')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiParam({
    name: 'trainingId',
    description: 'Идентификатор тренировки',
    type: Number,
    example: 10,
  })
  @ApiOperation({
    summary: 'Выполнить тренировку',
  })
  @ApiCreatedResponse({
    description: 'Создана запись о выполненой тренировке',
    type: CompletedTrainingRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  @ApiNotFoundResponse({
    description: 'Тренировка с данным id не найдена',
  })
  @ApiBadRequestResponse({
    description: 'Невалидный id тренировки',
  })
  async create(
    @Param('trainingId', ParseIntPipe) trainingId: number,
    @User() sportsman: JWTPayload,
  ) {
    return fillObject(
      CompletedTrainingRDO,
      await this.trainingDiaryService.create(sportsman.sub, trainingId),
    );
  }

  @Get()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить список выполненных тренировок за указаный интервал времени',
  })
  @ApiOkResponse({
    description: 'Список выполненых тренировок за указаный интервал времени',
    type: [CompletedTrainingRDO],
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
  async getMany(
    @Body() dto: GetCompletedTrainingsDTO,
    @User() sportsman: JWTPayload,
    @Query() query: CompletedTrainingsQuery,
  ) {
    return fillObject(
      CompletedTrainingListRDO,
      await this.trainingDiaryService.getMany(sportsman.sub, dto, query),
    );
  }
}
