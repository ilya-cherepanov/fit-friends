import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import {FriendRepository} from './friend.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {NotificationsModule} from '../notifications/notifications.module';
import {SportsmenModule} from '../sportsmen/sportsmen.module';

describe('FriendsService', () => {
  let service: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        NotificationsModule,
        SportsmenModule
      ],
      providers: [FriendsService, FriendRepository],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
