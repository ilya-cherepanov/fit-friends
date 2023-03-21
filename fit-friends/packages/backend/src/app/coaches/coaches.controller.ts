import {Body, Controller, Post, Put, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import {RegisterCoachDTO} from './dto/register-coach.dto';
import {FileFieldsInterceptor} from '@nestjs/platform-express';
import {CoachesService} from './coaches.service';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {JWTPayload} from '@fit-friends/shared-types';
import {UpdateCoachDTO} from './dto/update-coach.dto';
import {User} from '../auth/decorators/user.decorator';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {Roles} from '../auth/decorators/roles.decorator';
import {UserRole} from '@fit-friends/core';

@Controller('coaches')
@ApiTags('Coaches', 'Users')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'avatar'},
    {name: 'certificate'},
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiConflictResponse({
    description: 'Пользователь с таким email уже существует',
  })
  @ApiCreatedResponse({
    description: 'Регистрирует тренера',
  })
  async create(
    @Body() dto: RegisterCoachDTO,
    @UploadedFiles() files: {avatar: Express.Multer.File[], certificate: Express.Multer.File[]},
  ) {
    await this.coachesService.create(dto, files.avatar[0].filename, files.certificate[0].filename);
  }

  @Put()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'avatar'},
    {name: 'certificate'},
  ]))
  @Roles(UserRole.Coach)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Данные пользователя изменены',
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является тренером',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async update(
    @User() user: JWTPayload,
    @Body() dto: UpdateCoachDTO,
    @UploadedFiles() files: {avatar: Express.Multer.File[], certificate: Express.Multer.File[]}
  ) {
    await this.coachesService.update(user.sub, dto, files?.avatar?.[0].filename, files?.certificate?.[0].filename)
  }
}
