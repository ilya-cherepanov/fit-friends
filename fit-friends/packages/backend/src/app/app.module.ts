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
import { uploadOptions } from '../config/upload.config';
import { EatingsModule } from './eatings/eatings.module';
import { TrainingDiaryModule } from './training-diary/training-diary.module';
import { FriendsModule } from './friends/friends.module';
import { GymsModule } from './gyms/gyms.module';
import { BalanceModule } from './balance/balance.module';
import { MailingModule } from './mailing/mailing.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { mailOptions } from '../config/mail.config';
import { NotificationsModule } from './notifications/notifications.module';

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
      load: [jwtOptions, uploadOptions, mailOptions],
    }),
    PrismaModule,
    EatingsModule,
    TrainingDiaryModule,
    FriendsModule,
    GymsModule,
    BalanceModule,
    MailingModule,
    SubscribersModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
