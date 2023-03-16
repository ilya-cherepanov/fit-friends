import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import {RegisterCoachDTO} from './dto/register-coach.dto';
import {FileFieldsInterceptor} from '@nestjs/platform-express';
import {CoachesService} from './coaches.service';
import {ApiConflictResponse, ApiConsumes, ApiCreatedResponse, ApiTags} from '@nestjs/swagger';

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
}
