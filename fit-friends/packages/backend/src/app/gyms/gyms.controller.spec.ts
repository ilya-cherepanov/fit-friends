import { Test, TestingModule } from '@nestjs/testing';
import { GymsController } from './gyms.controller';
import {GymsService} from './gyms.service';
import {GymRepository} from './gym.repository';
import {PrismaModule} from '../prisma/prisma.module';

describe('GymsController', () => {
  let controller: GymsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [GymsController],
      providers: [GymsService, GymRepository],
    }).compile();

    controller = module.get<GymsController>(GymsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
