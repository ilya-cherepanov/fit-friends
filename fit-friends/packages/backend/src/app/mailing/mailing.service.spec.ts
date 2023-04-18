import {Test, TestingModule} from '@nestjs/testing';
import {MailingService} from './mailing.service';
import {ConfigModule} from '@nestjs/config';
import {ENV_FILE_PATH} from '../../constants';
import {envSchema} from '../env.schema';
import {uploadOptions} from '../../config/upload.config';
import {jwtOptions} from '../../config/jwt.config';
import {getMailConfig, mailOptions} from '../../config/mail.config';
import {MailerModule} from '@nestjs-modules/mailer';


describe('MailingService', () => {
  let service: MailingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          envFilePath: ENV_FILE_PATH,
          validationSchema: envSchema,
          load: [jwtOptions, uploadOptions, mailOptions],
        }),
        MailerModule.forRootAsync(getMailConfig()),
      ],
      providers: [MailingService],
    }).compile();

    service = module.get<MailingService>(MailingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
