import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {UserRepository} from '../users/user.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {UsersModule} from '../users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule} from '@nestjs/config';
import {ENV_FILE_PATH} from '../../constants';
import {envSchema} from '../env.schema';
import {uploadOptions} from '../../config/upload.config';
import {mailOptions} from '../../config/mail.config';
import {jwtOptions} from '../../config/jwt.config';


describe('AuthService', () => {
  let service: AuthService;

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
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
