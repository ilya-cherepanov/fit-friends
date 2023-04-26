import {CoachesService} from './coaches.service';
import {CoachRepository} from './coach.repository';
import {Test, TestingModule} from '@nestjs/testing';
import {PrismaModule} from '../prisma/prisma.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {UserRepository} from '../users/user.repository';
import {Level, TrainingTimeIntervals, Location, TrainingType, UserRole, UserSex} from '@fit-friends/core';
import {hash} from 'bcrypt';
import {RegisterCoachDTO} from './dto/register-coach.dto';
import {BaseUserEntity} from '../users/user.entity';
import {BadRequestException, NotFoundException} from '@nestjs/common';


jest.mock('bcrypt');


describe('SportsmenService', () => {
  let coachesService: CoachesService;
  let coachRepository: DeepMockProxy<CoachRepository>;
  let userRepository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [CoachesService, CoachRepository, UserRepository],
    })
      .overrideProvider(CoachRepository)
      .useValue(mockDeep<CoachRepository>())
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .compile();

    coachesService = module.get<CoachesService>(CoachesService);
    coachRepository = module.get(CoachRepository);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(coachesService).toBeDefined();
  });

  const password = 'password1234'
  const coachId = 1;

  const user = {
    id: coachId,
    role: UserRole.Coach,
    sex: UserSex.Female,
    level: Level.Amateur,
    email: 'sportsman@mail.com',
    password: password,
    location: Location.Zvezdnaya,
    trainingTypes: [TrainingType.Pilates, TrainingType.Yoga],
    avatar: 'avatar.jpg',
    name: 'Valeria',
    birthDate: new Date(),
    createdAt: new Date(),
    refreshToken: null,
  };

  const coach = {
    id: user.id,
    certificate: 'certificate.pdf',
    achievements: 'Achievements',
    hasPersonalTrainings: true,
  };

  const sportsman = {
    id: user.id,
    trainingDuration: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
    caloriesPerDay: 1000,
    caloriesToLose: 2000,
    readyToTraining: true,
  };

  describe('create', () => {
    const coachDTO: RegisterCoachDTO = {
      role: user.role,
      sex: user.sex,
      level: user.level,
      email: user.email,
      achievements: coach.achievements,
      birthDate: user.birthDate.toISOString(),
      avatar: user.avatar,
      hasPersonalTrainings: coach.hasPersonalTrainings,
      trainingTypes: user.trainingTypes,
      certificate: coach.certificate,
      name: user.name,
      password: password,
      location: user.location,
    };

    it('should return new coach entity', async () => {
      jest.mocked(hash).mockResolvedValue(password as never);

      coachRepository.create.mockImplementation((data) => Promise.resolve({
        id: user.id,
        password: data.password,
        coach: {
          id: user.id,
          hasPersonalTrainings: data.hasPersonalTrainings,
          certificate: data.certificate,
          achievements: data.achievements,
        },
        role: data.role,
        sex: data.sex,
        level: data.level,
        email: data.email,
        avatar: data.avatar,
        refreshToken: null,
        name: data.name,
        birthDate: data.birthDate,
        trainingTypes: data.trainingTypes,
        createdAt: user.createdAt,
        location: data.location,
      }));

      const coachEntity = BaseUserEntity.createFromPrisma({
        ...user,
        coach: {
          ...coach
        },
      });

      await expect(
        coachesService.create(coachDTO, user.avatar, coach.certificate)
      ).resolves.toStrictEqual(coachEntity);
    });
  });

  describe('update', () => {
    const dto = {
      certificate: 'certificate2.pdf',
      hasPersonalTrainings: false,
    };

    it('should throw NotFoundException if coach not exists', async () => {
      userRepository.getById.mockResolvedValue(null);

      await expect(coachesService.update(coachId, dto, undefined, dto.certificate))
        .rejects.toThrowError(NotFoundException);
    });

    it('should throw BadRequestException if user is not coach', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        sportsman: {
          ...sportsman,
        },
        coach: null,
      });

      await expect(coachesService.update(coachId, dto, undefined, dto.certificate))
        .rejects.toThrowError(BadRequestException);
    });

    it('should return updated coachEntity', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach,
        },
        sportsman: null,
      });

      const coachEntity = BaseUserEntity.createFromPrisma({
        ...user,
        coach: {
          ...coach,
          ...dto,
        }
      });

      coachRepository.update.mockImplementation(async (data) => ({
        ...user,
        coach: {
          ...coach,
          certificate: data.certificate,
          hasPersonalTrainings: data.hasPersonalTrainings,
        },
      }));

      await expect(coachesService.update(coachId, dto, undefined, dto.certificate))
        .resolves.toStrictEqual(coachEntity);
    });
  });
});
