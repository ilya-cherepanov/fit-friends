import { Test, TestingModule } from '@nestjs/testing';
import { SubscribersService } from './subscribers.service';
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

describe('SubscribersService', () => {
  let service: SubscribersService;

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
    }).compile();

    service = module.get<SubscribersService>(SubscribersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
