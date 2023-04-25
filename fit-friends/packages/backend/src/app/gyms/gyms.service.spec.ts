import {Test, TestingModule} from '@nestjs/testing';
import {GymsService} from './gyms.service';
import {GymRepository} from './gym.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {Gym} from '@prisma/client';
import {GymParameters, Location} from '@fit-friends/core';
import {NotFoundException} from '@nestjs/common';


describe('GymsService', () => {
  let gymsService: GymsService;
  let gymRepository: DeepMockProxy<GymRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [GymsService, GymRepository],
    })
      .overrideProvider(GymRepository)
      .useValue(mockDeep<GymRepository>())
      .compile();

    gymsService = module.get<GymsService>(GymsService);
    gymRepository = module.get(GymRepository);
  });

  it('should be defined', () => {
    expect(gymsService).toBeDefined();
  });

  const gymId = 1;
  const gyms: Gym[] = [
    {
      id: 1,
      location: Location.Zvezdnaya,
      photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
      price: 600,
      parameters: [GymParameters.Pool],
      title: 'Gym #1',
      createdAt: new Date(),
      isVerified: true,
      description: 'Gym description #1',
    },
    {
      id: 2,
      location: Location.Zvezdnaya,
      photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
      price: 800,
      parameters: [GymParameters.Massage],
      title: 'Gym #2',
      createdAt: new Date(),
      isVerified: true,
      description: 'Gym description #2',
    },
    {
      id: 3,
      location: Location.Zvezdnaya,
      photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
      price: 1000,
      parameters: [GymParameters.Pool, GymParameters.FreeParking],
      title: 'Gym #3',
      createdAt: new Date(),
      isVerified: false,
      description: 'Gym description #3',
    },
  ];

  describe('getOne', () => {
    it('should throw NotFoundException if gym not found', async () => {
      gymRepository.getById.mockResolvedValue(null);

      await expect(gymsService.getOne(gymId)).rejects.toThrowError(NotFoundException);
    });

    it('should return a gym data', async () => {
      gymRepository.getById.mockResolvedValue({...gyms[0]});

      await expect(gymsService.getOne(gymId)).resolves.toStrictEqual({...gyms[0]});
    });
  });

  describe('getMany', () => {
    it ('should return list of gyms', async () => {
      const page = 0;
      gymRepository.getMany.mockResolvedValue({
        gyms: [
          ...gyms.map((gym) => ({...gym}))
        ],
        count: gyms.length,
      });

      await expect(gymsService.getMany({page})).resolves.toStrictEqual({
        currentPage: page,
        totalPages: 1,
        items: [...gyms.map((gym) => ({...gym}))],
      });
    });
  });

  describe('setFavorite', () => {
    const userId = 1;
    const gymId = 1;

    it ('should return favorite data', async () => {
      gymRepository.createFavorite.mockImplementation(async (userId, gymId) => ({
        id: 1,
        userId,
        gymId,
      }));

      await expect(gymsService.setFavorite(userId, gymId, true)).resolves.toStrictEqual({
        id: 1,
        userId,
        gymId,
      });
    });

    it('should call delete favorite', async () => {
      await gymsService.setFavorite(userId, gymId, false);

      expect(gymRepository.deleteFavorite).toBeCalledWith(userId, gymId);
    });
  });

  describe('getFavorites', () => {
    it('should return favorite gyms list', async () => {
      const page = 0;
      const userId = 1;

      gymRepository.getFavorites.mockResolvedValue({
        gyms: [
          ...gyms.map((gym) => ({...gym})),
        ],
        count: gyms.length,
      });

      await expect(gymsService.getFavorites(userId, page)).resolves.toStrictEqual({
        currentPage: page,
        totalPages: 1,
        items: [...gyms.map((gym) => ({...gym}))],
      });
    });
  });
});
