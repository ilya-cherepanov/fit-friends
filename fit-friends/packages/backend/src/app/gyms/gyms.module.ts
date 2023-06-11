import { Module } from '@nestjs/common';
import { GymsController } from './gyms.controller';
import { GymsService } from './gyms.service';
import {GymRepository} from './gym.repository';

@Module({
  controllers: [GymsController],
  providers: [GymsService, GymRepository],
  exports: [GymRepository],
})
export class GymsModule {}
