import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import {FriendsService} from './friends.service';
import {FriendRepository} from './friend.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {NotificationsModule} from '../notifications/notifications.module';
import {UsersModule} from '../users/users.module';


describe('FriendsController', () => {
  let controller: FriendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        NotificationsModule,
        UsersModule,
      ],
      controllers: [FriendsController],
      providers: [FriendsService, FriendRepository],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
