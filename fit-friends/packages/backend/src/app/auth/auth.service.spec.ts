import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {UserRepository} from '../users/user.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {UsersModule} from '../users/users.module';
import {JwtModule, JwtService} from '@nestjs/jwt';
import {ConfigModule} from '@nestjs/config';
import {ENV_FILE_PATH, SALT_ROUNDS} from '../../constants';
import {envSchema} from '../env.schema';
import {uploadOptions} from '../../config/upload.config';
import {mailOptions} from '../../config/mail.config';
import {jwtOptions} from '../../config/jwt.config';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {Coach, Sportsman, User} from '@prisma/client';
import {Level, Location, TrainingTimeIntervals, TrainingType, UserRole, UserSex} from '@fit-friends/core';
import {genSalt, hash} from 'bcrypt';
import {JWTPayload} from '@fit-friends/shared-types';


describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: DeepMockProxy<UserRepository>;
  let jwtService: DeepMockProxy<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        UsersModule,
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          envFilePath: ENV_FILE_PATH,
          validationSchema: envSchema,
          load: [jwtOptions, uploadOptions, mailOptions],
        }),
        JwtModule.register({}),
      ],
      providers: [AuthService, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .overrideProvider(JwtService)
      .useValue(mockDeep<JwtService>())
      .compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    const dto = {
      email: 'mail@mail.com',
      password: 'password1234',
    };

    const user: User = {
      id: 1,
      role: UserRole.Sportsman,
      sex: UserSex.Male,
      level: Level.Amateur,
      email: 'sportsman@mail.com',
      password: dto.password,
      location: Location.Zvezdnaya,
      trainingTypes: [TrainingType.Pilates, TrainingType.Yoga],
      avatar: 'avatar.jpg',
      name: 'Valeria',
      birthDate: new Date(),
      createdAt: new Date(),
      refreshToken: null,
    };

    const sportsman: Sportsman = {
      id: 1,
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

    const jwtPayload: JWTPayload = {
      sub: user.id,
      role: UserRole.Sportsman,
    };

    it('should throw UnauthorizedException if user not exists', async () => {
      userRepository.getByEmail.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw InternalServerError if user is not valid', async () => {
      userRepository.getByEmail.mockResolvedValue({
        ...user,
        sportsman: undefined,
        coach: undefined,
        role: 'wrong',
      });

      await expect(authService.login(dto)).rejects.toThrowError(InternalServerErrorException);
    });

    it('should throw UnauthorizedException if password is not right', async () => {
      const passwordHash = await hash(user.password, await genSalt(SALT_ROUNDS));

      userRepository.getByEmail.mockResolvedValue({
        ...user,
        sportsman,
        coach: undefined,
        password: passwordHash,
      });

      await expect(authService.login({...dto, password: '1234'})).rejects.toThrowError(UnauthorizedException);
    });

    it('should return token pair', async () => {
      jwtService.signAsync.mockResolvedValueOnce('access');
      jwtService.signAsync.mockResolvedValueOnce('refresh');

      const passwordHash = await hash(dto.password, await genSalt(SALT_ROUNDS));

      userRepository.getByEmail.mockResolvedValue({
        ...user,
        sportsman,
        coach: undefined,
        password: passwordHash,
      });

      await expect(authService.login(dto)).resolves.toStrictEqual({
        accessToken: 'access',
        refreshToken: 'refresh'
      });
    });
  });

  describe('refresh', () => {
    const jwtPayload: JWTPayload = {
      sub: 1,
      role: UserRole.Sportsman,
      refreshToken: 'old-refresh',
    };

    const user: User = {
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

    const sportsman: Sportsman = {
      id: 1,
      trainingDuration: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
      caloriesPerDay: 1000,
      caloriesToLose: 2000,
      readyToTraining: true,
    };

    it('should throw NotFoundException if user not exists', async () => {
      userRepository.getById.mockResolvedValue(null);

      await expect(authService.refresh({...jwtPayload})).rejects.toThrowError(NotFoundException);
    });

    it('should throw ForbiddenException if refresh token is wrong', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        sportsman: sportsman,
        coach: undefined,
        refreshToken: 'another-refresh',
      });

      await expect(authService.refresh({...jwtPayload})).rejects.toThrowError(ForbiddenException);
    });

    it('should return token pair', async () => {
      jwtService.signAsync.mockResolvedValueOnce('access');
      jwtService.signAsync.mockResolvedValueOnce('new-refresh');

      userRepository.getById.mockResolvedValue({
        ...user,
        sportsman: sportsman,
        coach: undefined,
        refreshToken: 'old-refresh',
      });

      await expect(authService.refresh({...jwtPayload})).resolves.toStrictEqual({
        accessToken: 'access',
        refreshToken: 'new-refresh',
      });
    });
  });

  describe('logout', () => {
    const dto = {
      email: 'mail@mail.com',
      password: 'password1234',
    };

    const user: User = {
      id: 1,
      role: UserRole.Sportsman,
      sex: UserSex.Male,
      level: Level.Amateur,
      email: 'sportsman@mail.com',
      password: dto.password,
      location: Location.Zvezdnaya,
      trainingTypes: [TrainingType.Pilates, TrainingType.Yoga],
      avatar: 'avatar.jpg',
      name: 'Valeria',
      birthDate: new Date(),
      createdAt: new Date(),
      refreshToken: null,
    };

    it('should be resolved', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: undefined,
        sportsman: undefined,
      });

      userRepository.saveRefreshToken.mockResolvedValue({
        ...user,
      });

      await expect(authService.logout(user.id)).resolves;
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.getById.mockResolvedValue(null);

      await expect(authService.logout(user.id)).rejects.toThrowError(NotFoundException);
    });
  });
});
