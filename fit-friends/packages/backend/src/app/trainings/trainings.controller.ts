import {Body, Controller, ParseFilePipeBuilder, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
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
  ApiBadRequestResponse, ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse, ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';


@Controller('trainings')
@ApiTags('Trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Coach)
  @ApiConsumes('multipart/form-data')
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
}
