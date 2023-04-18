import { Test, TestingModule } from '@nestjs/testing';
import { EatingsController } from './eatings.controller';
import {EatingsService} from './eatings.service';
import {EatingRepository} from './eating.repository';
import {PrismaModule} from '../prisma/prisma.module';

describe('EatingsController', () => {
  let controller: EatingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      controllers: [EatingsController],
      providers: [EatingsService, EatingRepository],
    }).compile();

    controller = module.get<EatingsController>(EatingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
