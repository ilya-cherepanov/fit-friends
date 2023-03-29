import {
  Body,
  Controller,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {RegisterSportsmanDTO} from './dto/register-sportsman.dto';
import {fillObject, USER_AVATAR_FORMATS_REG_EXP, USER_AVATAR_MAX_SIZE, UserRole} from '@fit-friends/core';
import {SportsmenService} from './sportsmen.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse, ApiOkResponse, ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {JWTPayload} from '@fit-friends/shared-types';
import {User} from '../auth/decorators/user.decorator';
import {UpdateSportsmanDTO} from './dto/update-sportsman.dto';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {Roles} from '../auth/decorators/roles.decorator';
import {SportsmanRDO} from '../users/rdo/user.rdo';

@Controller('sportsmen')
@ApiTags('Sportsmen', 'Users')
export class SportsmenController {
  constructor(private readonly sportsmenService: SportsmenService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Зарегистрировать спортсмена',
  })
  @ApiConflictResponse({
    description: 'Пользователь с таким email уже существует',
  })
  @ApiCreatedResponse({
    description: 'Регистрирует спортсмена',
    type: SportsmanRDO,
  })
  async create(
    @Body() dto: RegisterSportsmanDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({fileType: USER_AVATAR_FORMATS_REG_EXP})
        .addMaxSizeValidator({maxSize: USER_AVATAR_MAX_SIZE})
        .build({fileIsRequired: false})) avatar?: Express.Multer.File
  ) {
    return fillObject(SportsmanRDO, await this.sportsmenService.create(dto, avatar?.filename));
  }

  @Put()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(UserRole.Sportsman)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Редактировать данные спортсмена',
  })
  @ApiOkResponse({
    description: 'Данные пользователя изменены',
    type: SportsmanRDO,
  })
  @ApiForbiddenResponse({
    description: 'Пользователь не является спортсменом',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async update(
    @User() user: JWTPayload,
    @Body() dto: UpdateSportsmanDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({fileType: USER_AVATAR_FORMATS_REG_EXP})
        .addMaxSizeValidator({maxSize: USER_AVATAR_MAX_SIZE})
        .build({fileIsRequired: false})) avatar?: Express.Multer.File
  ) {
    return fillObject(SportsmanRDO, await this.sportsmenService.update(user.sub, dto, avatar.filename));
  }

}
