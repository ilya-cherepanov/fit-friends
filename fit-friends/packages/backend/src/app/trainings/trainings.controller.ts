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
  ApiBadRequestResponse, ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {UpdateTrainingDTO} from './dto/update-traininig.dto';
import {TrainingListQuery} from './query/training-list.query';
import {TrainingListRDO} from './rdo/training-list.rdo';


@Controller('trainings')
@ApiTags('Trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Возвращает список тренеровок тренера',
    type: TrainingRDO,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async get(@Param('id', ParseIntPipe) id: number) {
    return fillObject(TrainingRDO, await this.trainingsService.get(id));
  }

  @Get()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Coach)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Возвращает список тренеровок тренера',
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
  async getMany(@Query() query: TrainingListQuery, @User() coach: JWTPayload) {
    return fillObject(TrainingListRDO, await this.trainingsService.getMany(query, coach.sub))
  }

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Coach)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Возвращает только что созданную тренеровку',
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

  @Put(':id')
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Coach)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
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
