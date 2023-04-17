import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {TrainingsService} from './trainings.service';
import {CreateTrainingDTO} from './dto/create-training.dto';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';
import {fillObject, TRAINING_VIDEO_FORMATS_REG_EXP, UserRole} from '@fit-friends/core';
import {TrainingRDO} from './rdo/training.rdo';
import {FileInterceptor} from '@nestjs/platform-express';
import {Roles} from '../auth/decorators/roles.decorator';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {UpdateTrainingDTO} from './dto/update-traininig.dto';
import {TrainingListQuery} from './query/training-list.query';
import {TrainingListRDO} from './rdo/training-list.rdo';


@Controller()
@ApiTags('Trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Get('trainings/:id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить данные тренировки',
  })
  @ApiOkResponse({
    description: 'Возвращает список тренировок тренера',
    type: TrainingRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async get(@Param('id', ParseIntPipe) id: number) {
    return fillObject(TrainingRDO, await this.trainingsService.get(id));
  }

  @Get('trainings')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить список тренировок',
  })
  @ApiOkResponse({
    description: 'Возвращает список тренировок',
    type: TrainingListRDO,
  })
  @ApiBadRequestResponse({
    description: 'Неверная строка запроса',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async getMany(@Query() query: TrainingListQuery) {
    return fillObject(TrainingListRDO, await this.trainingsService.getMany(query));
  }


  @Get('coach-trainings')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Coach)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить список тренировок тренера',
  })
  @ApiOkResponse({
    description: 'Возвращает список тренировок тренера',
    type: TrainingListRDO,
  })
  @ApiBadRequestResponse({
    description: 'Неверная строка запроса',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является тренером',
  })
  async getCoachMany(@Query() query: TrainingListQuery, @User() coach: JWTPayload) {
    return fillObject(TrainingListRDO, await this.trainingsService.getMany(query, coach.sub));
  }

  @Post('trainings')
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Coach)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать тренировку',
  })
  @ApiCreatedResponse({
    description: 'Возвращает только что созданную тренировку',
    type: TrainingRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является тренером',
  })
  @ApiBadRequestResponse({
    description: 'Неверно заполнена форма',
  })
  async create(
    @Body() dto: CreateTrainingDTO,
    @User() user: JWTPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({fileType: TRAINING_VIDEO_FORMATS_REG_EXP})
        .build()
    ) video: Express.Multer.File
  ) {
    return fillObject(TrainingRDO, await this.trainingsService.create(dto, user.sub, video.filename));
  }

  @Put('trainings/:id')
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Coach)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Редактировать данные тренировки',
  })
  @ApiOkResponse({
    description: 'Возвращает обновленные данные о тренировке',
    type: TrainingRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является тренером',
  })
  @ApiBadRequestResponse({
    description: 'Неверно заполнена форма',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTrainingDTO,
    @User() user: JWTPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({fileType: TRAINING_VIDEO_FORMATS_REG_EXP})
        .build({fileIsRequired: false})
    ) video?: Express.Multer.File
  ) {
    return fillObject(TrainingRDO, await this.trainingsService.update(id, dto, user.sub, video?.filename));
  }
}
