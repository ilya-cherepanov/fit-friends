import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import {SportsmenModule} from '../sportsmen/sportsmen.module';
import {FriendRepository} from './friend.repository';
import {NotificationsModule} from '../notifications/notifications.module';
import {UsersModule} from '../users/users.module';


@Module({
  imports: [UsersModule, NotificationsModule],
  controllers: [FriendsController],
  providers: [FriendsService, FriendRepository],
})
export class FriendsModule {}
