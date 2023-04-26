import {CoachRepository} from './coach.repository';
import {mockDeep} from 'jest-mock-extended';
import {PrismaService} from '../prisma/prisma.service';
import {Test} from '@nestjs/testing';
import {PrismaModule} from '../prisma/prisma.module';


describe('CoachRepository', () => {
  let coachRepository: CoachRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CoachRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    coachRepository = module.get(CoachRepository);
  });

  it('should be defined', () => {
    expect(coachRepository).toBeDefined()
  });
});
