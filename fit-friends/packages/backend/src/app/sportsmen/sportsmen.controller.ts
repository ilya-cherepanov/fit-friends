import {Body, Controller, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {RegisterSportsmanDTO} from './dto/register-sportsman.dto';
import {USER_AVATAR_FORMATS_REG_EXP, USER_AVATAR_MAX_SIZE} from '@fit-friends/core';
import {SportsmenService} from './sportsmen.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiAcceptedResponse, ApiConflictResponse, ApiConsumes, ApiCreatedResponse, ApiTags} from '@nestjs/swagger';

@Controller('sportsmen')
@ApiTags('Sportsmen', 'Users')
export class SportsmenController {
  constructor(private readonly sportsmenService: SportsmenService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiConflictResponse({
    description: 'Пользователь с таким email уже существует',
  })
  @ApiCreatedResponse({
    description: 'Регистрирует спортсмена',
  })
  async create(
    @Body() dto: RegisterSportsmanDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({fileType: USER_AVATAR_FORMATS_REG_EXP})
        .addMaxSizeValidator({maxSize: USER_AVATAR_MAX_SIZE})
        .build({fileIsRequired: false})) avatar?: Express.Multer.File
  ) {
    await this.sportsmenService.create(dto, avatar?.filename);
  }
}
