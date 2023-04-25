import {UsersService} from './users.service';
import {UserRepository} from './user.repository';
import {Test} from '@nestjs/testing';
import {PrismaModule} from '../prisma/prisma.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {Coach, Sportsman, User} from '@prisma/client';
import {Level, TrainingTimeIntervals, TrainingType, UserRole, UserSex, Location} from '@fit-friends/core';
import {NotFoundException} from '@nestjs/common';
import {BaseUserEntity} from './user.entity';


describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .compile();

    usersService = module.get(UsersService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  const userId = 1;

  const user: User = {
    id: userId,
    role: UserRole.Sportsman,
    sex: UserSex.Female,
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

  const sportsman: Sportsman = {
    id: userId,
    trainingDuration: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
    caloriesPerDay: 1000,
    caloriesToLose: 2000,
    readyToTraining: true,
  };

  const coach: Coach = {
    id: 1,
    certificate: 'certificate.png',
    achievements: 'Achievements',
    hasPersonalTrainings: true,
  };

  describe('get', () => {
    it('should throw NotFoundException if user not found', async () => {
      userRepository.getById.mockResolvedValue(null);

      await expect(usersService.get(userId)).rejects.toThrowError(NotFoundException);
    });

    it('return user entity if user found', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: null,
        sportsman: {
          ...sportsman
        },
      });

      const userEntity = BaseUserEntity.createFromPrisma({
        ...user,
        coach: null,
        sportsman: {
          ...sportsman
        },
      });

      await expect(usersService.get(userId)).resolves.toStrictEqual(userEntity);
    });
  });

  describe('getAll', () => {
    const users = [
      {
        ...user,
        coach: null,
        sportsman: {
          ...sportsman,
        },
      },
      {
        ...user,
        id: 2,
        coach: null,
        sportsman: {
          ...sportsman,
          id: 2,
        },
      },
      {
        ...user,
        id: 3,
        coach: {
          ...coach,
          id: 3,
        },
        sportsman: null,
      },
    ];

    const page = 0;

    it('should return users list', async () => {
      userRepository.count.mockResolvedValue(users.length);
      userRepository.getAll.mockResolvedValue([...users]);

      const userEntitites = users.map((user) => BaseUserEntity.createFromPrisma(user));
      await expect(usersService.getAll({page})).resolves.toStrictEqual({
        currentPage: page,
        totalPages: 1,
        users: [...userEntitites],
      });
    });
  });
});
