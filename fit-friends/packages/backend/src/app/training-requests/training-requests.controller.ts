import {Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards} from '@nestjs/common';
import {TrainingRequestsService} from './training-requests.service';
import {Roles} from '../auth/decorators/roles.decorator';
import {UserRole} from '@fit-friends/core';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {RolesGuard} from '../auth/guards/roles.guard';
import {
  ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOperation, ApiParam, ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';


@Controller('training-requests')
@ApiTags('Training requests')
export class TrainingRequestsController {
  constructor(private readonly trainingRequestService: TrainingRequestsService) {}

  @Post(':targetId')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Отправить приглашение на тренировку',
  })
  @ApiParam({
    name: 'targetId',
    description: 'Идентификатор пользователя которому адресовано приглашение',
    example: 10,
  })
  @ApiCreatedResponse({
    description: 'Создано приглашение на тренировку',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  @ApiBadRequestResponse({
    description: 'Не валидный запрос',
  })
  @ApiConflictResponse({
    description: 'Приглашение на тренировку уже существует'
  })
  async create(@Param('targetId', ParseIntPipe) targetId: number, @User() user: JWTPayload) {
    await this.trainingRequestService.create(user, targetId);
  }

  @Put(':initiatorId/accept')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Принять приглашение на тренировку',
  })
  @ApiParam({
    name: 'initiatorId',
    description: 'Пользователь, который отправил предложение тренировки',
    example: 10,
  })
  @ApiCreatedResponse({
    description: 'Создано приглашение на тренировку',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  @ApiBadRequestResponse({
    description: 'Не валидный запрос',
  })
  @ApiNotFoundResponse({
    description: 'Приглашение на тренировку не существует',
  })
  async accept(@Param('initiatorId', ParseIntPipe) initiatorId: number, @User() user: JWTPayload) {
    await this.trainingRequestService.accept(user, initiatorId);
  }

  @Put(':initiatorId/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Отклонить приглашение на тренировку',
  })
  @ApiParam({
    name: 'initiatorId',
    description: 'Пользователь, который отправил предложение тренировки',
    example: 10,
  })
  @ApiCreatedResponse({
    description: 'Создано приглашение на тренировку',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  @ApiBadRequestResponse({
    description: 'Не валидный запрос',
  })
  @ApiNotFoundResponse({
    description: 'Приглашение на тренировку не существует',
  })
  async reject(@Param('initiatorId', ParseIntPipe) initiatorId: number, @User() user: JWTPayload) {
    await this.trainingRequestService.reject(user, initiatorId);
  }
}
