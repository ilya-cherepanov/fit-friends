import {Test, TestingModule} from '@nestjs/testing';
import {SubscribersService} from './subscribers.service';
import {SubscriberRepository} from './subscriber.repository';
import {MailingModule} from '../mailing/mailing.module';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingsModule} from '../trainings/trainings.module';
import {ConfigModule} from '@nestjs/config';
import {ENV_FILE_PATH} from '../../constants';
import {envSchema} from '../env.schema';
import {jwtOptions} from '../../config/jwt.config';
import {uploadOptions} from '../../config/upload.config';
import {mailOptions} from '../../config/mail.config';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {TrainingRepository} from '../trainings/training.repository';
import {MailingService} from '../mailing/mailing.service';
import {faker} from '@faker-js/faker/locale/ru';


describe('SubscribersService', () => {
  let subscribersService: SubscribersService;
  let subscriberRepository: DeepMockProxy<SubscriberRepository>;
  let trainingRepository: DeepMockProxy<TrainingRepository>;
  let mailingService: DeepMockProxy<MailingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MailingModule,
        PrismaModule,
        TrainingsModule,
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          envFilePath: ENV_FILE_PATH,
          validationSchema: envSchema,
          load: [jwtOptions, uploadOptions, mailOptions],
        }),
      ],
      providers: [SubscribersService, SubscriberRepository],
    })
      .overrideProvider(SubscriberRepository)
      .useValue(mockDeep<SubscriberRepository>())
      .overrideProvider(TrainingRepository)
      .useValue(mockDeep<TrainingRepository>())
      .overrideProvider(MailingService)
      .useValue(mockDeep<MailingService>())
      .compile();

    subscribersService = module.get<SubscribersService>(SubscribersService);
    subscriberRepository = module.get(SubscriberRepository);
    trainingRepository = module.get(TrainingRepository);
    mailingService = module.get(MailingService);
  });

  it('should be defined', () => {
    expect(subscribersService).toBeDefined();
  });

  const sportsmanId = 1;
  const coachId = 2;

  describe('get', () => {
    it('should return false if subscribe does not exists', async () => {
      subscriberRepository.get.mockResolvedValue(null);

      await expect(subscribersService.get(sportsmanId, coachId)).resolves.toStrictEqual({
        isSubscribed: false,
      })
    });

    it('should return subscribed status', async () => {
      const needToClean = true;

      subscriberRepository.get.mockImplementation(async (sportsmanId, coachId) => ({
        needToClean,
        trainerId: coachId,
        subscriberId: sportsmanId,
      }));

      await expect(subscribersService.get(sportsmanId, coachId)).resolves.toStrictEqual({
        isSubscribed: !needToClean,
      })
    });
  });

  describe('setState', () => {
    it('should return subscribed status', async () => {
      const state = true;

      subscriberRepository.setSubscription.mockImplementation(
        async (sportsmanId, coachId, state) => ({
          needToClean: !state,
          trainerId: coachId,
          subscriberId: sportsmanId,
        })
      );

      await expect(subscribersService.setState(sportsmanId, coachId, state)).resolves.toStrictEqual({
        isSubscribed: state,
      })
    });
  });

  describe('sendNotifications', () => {
    it('should be successfully called', async () => {
      const subscribers = [
        {
          id: 1,
          email: faker.internet.email(),
          name: faker.name.firstName(),
          coaches: [
            {
              id: 2,
              name: faker.name.firstName(),
              trainings: [
                {
                  id: 1,
                  title: faker.random.word(),
                  description: faker.lorem.sentence(),
                },
                {
                  id: 2,
                  title: faker.random.word(),
                  description: faker.lorem.sentence(),
                },
                {
                  id: 3,
                  title: faker.random.word(),
                  description: faker.lorem.sentence(),
                }
              ],
            },
          ],
        }
      ];

      subscriberRepository.getAll.mockResolvedValue([...subscribers]);

      await subscribersService.sendNotifications();

      expect(mailingService.sendTrainingNotifications).toBeCalledWith([...subscribers]);
      expect(trainingRepository.resetNew).toBeCalled();
      expect(subscriberRepository.clear).toBeCalled();
    });
  });
});
