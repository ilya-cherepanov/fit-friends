import {CoachRepository} from './coach.repository';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {PrismaService} from '../prisma/prisma.service';
import {Test} from '@nestjs/testing';
import {PrismaModule} from '../prisma/prisma.module';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime';
import {PRISMA_VIOLATION_OF_UNIQUENESS_CODE} from '../../constants';
import {TrainingTimeIntervals, TrainingType, UserRole, UserSex, Location, Level} from '@fit-friends/core';
import {CoachEntity} from '../users/user.entity';
import {ConflictException} from '@nestjs/common';


describe('CoachRepository', () => {
  let prismaService: DeepMockProxy<PrismaService>
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
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(CoachRepository).toBeDefined()
  });

  describe('create', () => {

    const user = {
      id: 1,
      role: UserRole.Sportsman,
      sex: UserSex.Male,
      level: Level.Amateur,
      email: 'sportsman@mail.com',
      password: 'password',
      location: Location.Zvezdnaya,
      trainingTypes: [TrainingType.Pilates, TrainingType.Yoga],
      avatar: 'avatar.jpg',
      name: 'Valeria',
      birthDate: new Date(),
      createdAt: new Date(),
      refreshToken: null,
    };

    const sportsman = {
      id: 1,
      trainingDuration: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
      caloriesPerDay: 1000,
      caloriesToLose: 2000,
      readyToTraining: true,
    };

    const coach = {
      id: 1,
      certificate: 'certificate.png',
      achievements: 'Achievements',
      hasPersonalTrainings: true,
    };

    // it('should throw ConflictException if email already exists', async () => {
    //   const exception = new PrismaClientKnownRequestError(
    //     '',
    //     {clientVersion: '1', code: PRISMA_VIOLATION_OF_UNIQUENESS_CODE}
    //   );
    //
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   prismaService.user.create.mockImplementation(async () => {
    //     console.log(exception);
    //     throw exception;
    //   });
    //
    //   const coachEntity = new CoachEntity({
    //     ...user,
    //     ...coach,
    //   });
    //
    //   await expect(coachRepository.create(coachEntity)).rejects.toThrowError(ConflictException);
    // });
  });
});
