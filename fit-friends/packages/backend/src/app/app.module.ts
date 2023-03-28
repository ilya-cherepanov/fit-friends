import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoachesModule } from './coaches/coaches.module';
import { SportsmenModule } from './sportsmen/sportsmen.module';
import { TrainingsModule } from './trainings/trainings.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { ENV_FILE_PATH } from '../constants';
import { jwtOptions } from '../config/jwt.config';
import { envSchema } from './env.schema';
import { PrismaModule } from './prisma/prisma.module';
import {uploadOptions} from '../config/upload.config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CoachesModule,
    SportsmenModule,
    TrainingsModule,
    OrdersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ENV_FILE_PATH,
      validationSchema: envSchema,
      load: [jwtOptions, uploadOptions],
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
