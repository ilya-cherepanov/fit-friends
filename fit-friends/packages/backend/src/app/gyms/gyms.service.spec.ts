import { Test, TestingModule } from '@nestjs/testing';
import { GymsService } from './gyms.service';
import {GymRepository} from './gym.repository';
import {PrismaModule} from '../prisma/prisma.module';

describe('GymsService', () => {
  let service: GymsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [GymsService, GymRepository],
    }).compile();

    service = module.get<GymsService>(GymsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
