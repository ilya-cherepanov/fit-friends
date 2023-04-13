import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {CreateEatingDTO} from './dto/create-eating.dto';
import {JWTAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {UserRole} from '@fit-friends/core';
import {Roles} from '../auth/decorators/roles.decorator';
import {EatingsService} from './eatings.service';
import {User} from '../auth/decorators/user.decorator';
import {JWTPayload} from '@fit-friends/shared-types';


@Controller('eatings')
export class EatingsController {
  constructor(private readonly eatingsService: EatingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.Sportsman)
  async change(@Body() dto: CreateEatingDTO, @User() user: JWTPayload) {
  }
}
