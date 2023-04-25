import {Test, TestingModule} from '@nestjs/testing';
import {PrismaModule} from '../prisma/prisma.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {UserRepository} from '../users/user.repository';
import {Level, TrainingTimeIntervals, Location, TrainingType, UserRole, UserSex} from '@fit-friends/core';
import {hash} from 'bcrypt';
import {BaseUserEntity} from '../users/user.entity';
import {BadRequestException, NotFoundException} from '@nestjs/common';
import {SportsmenService} from './sportsmen.service';
import {SportsmanRepository} from './sportsman.repository';
import {RegisterSportsmanDTO} from './dto/register-sportsman.dto';


jest.mock('bcrypt');


describe('SportsmenService', () => {
  let sportsmenService: SportsmenService;
  let sportsmanRepository: DeepMockProxy<SportsmanRepository>;
  let userRepository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [SportsmenService, SportsmanRepository, UserRepository],
    })
      .overrideProvider(SportsmanRepository)
      .useValue(mockDeep<SportsmanRepository>())
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .compile();

    sportsmenService = module.get<SportsmenService>(SportsmenService);
    sportsmanRepository = module.get(SportsmanRepository);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(sportsmenService).toBeDefined();
  });

  const password = 'password1234'
  const sportsmanId = 1;

  const user = {
    id: sportsmanId,
    role: UserRole.Sportsman,
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
    const sportsmanDTO: RegisterSportsmanDTO = {
      role: user.role,
      sex: user.sex,
      level: user.level,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
      avatar: user.avatar,
      trainingTypes: user.trainingTypes,
      name: user.name,
      password: password,
      location: user.location,
      caloriesPerDay: sportsman.caloriesPerDay,
      trainingDuration: sportsman.trainingDuration,
      caloriesToLose: sportsman.caloriesToLose,
    };

    it('should return new sportsman entity', async () => {
      jest.mocked(hash).mockResolvedValue(password as never);

      sportsmanRepository.create.mockImplementation(async (data) => ({
        id: user.id,
        password: data.password,
        sportsman: {
          ...sportsman,
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
        sportsman: {
          ...sportsman,
        },
      });

      await expect(
        sportsmenService.create(sportsmanDTO, user.avatar)
      ).resolves.toStrictEqual(coachEntity);
    });
  });

  describe('update', () => {
    const dto = {
      caloriesPerDay: 1200,
      readyToTraining: false,
    };

    it('should throw NotFoundException if sportsman not exists', async () => {
      userRepository.getById.mockResolvedValue(null);

      await expect(sportsmenService.update(sportsmanId, dto, undefined))
        .rejects.toThrowError(NotFoundException);
    });

    it('should throw BadRequestException if user is not sportsman', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach
        },
        sportsman: null,
      });

      await expect(sportsmenService.update(sportsmanId, dto, undefined))
        .rejects.toThrowError(BadRequestException);
    });

    it('should return updated sportsmanEntity', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        sportsman: {
          ...sportsman,
        },
        coach: null,
      });

      const sportsmanEntity = BaseUserEntity.createFromPrisma({
        ...user,
        sportsman: {
          ...sportsman,
          ...dto,
        },
      });

      sportsmanRepository.update.mockImplementation(async (data) => ({
        ...user,
        sportsman: {
          ...sportsman,
          caloriesPerDay: data.caloriesPerDay,
          readyToTraining: data.readyToTraining,
        },
      }));

      await expect(sportsmenService.update(sportsmanId, dto, undefined))
        .resolves.toStrictEqual(sportsmanEntity);
    });
  });
});
