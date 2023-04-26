import {PrismaService} from '../prisma/prisma.service';
import {FriendStatus} from '@fit-friends/core';
import {Prisma} from '@prisma/client';
import {
  FRIEND_ALREADY_EXISTS,
  PRISMA_VIOLATION_OF_UNIQUENESS_CODE,
} from '../../constants';
import {ConflictException, Injectable} from '@nestjs/common';


@Injectable()
export class FriendRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(userId: number, friendId: number) {
    return this.prismaService.user.findFirst({
      where: {
        id: userId,
        OR: [
          {
            friends: {
              some: {
                userId: friendId,
              }
            },
          },
          {
            friendsBy: {
              some: {
                friendId,
              }
            },
          },
        ],
      },
      include: {
        sportsman: true,
        coach: true,
      },
    });
  }

  async create(sportsmanId: number, friendId: number) {
    try {
      return await this.prismaService.friend.create({
        data: {
          userId: sportsmanId,
          friendId,
          status: FriendStatus.Accepted,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError
        && err.code === PRISMA_VIOLATION_OF_UNIQUENESS_CODE) {
        throw new ConflictException(FRIEND_ALREADY_EXISTS);
      }

      throw err;
    }
  }

  async getMany(take: number, skip: number, userId: number) {
    const [friends, count] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where: {
          OR: [
            {
              friendsBy: {
                some: {
                  friendId: userId,
                },
              },
            },
            {
              friends: {
                some: {
                  userId,
                },
              },
            }
          ],
        },
        include: {
          sportsman: true,
          coach: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip,
      }),
      this.prismaService.friend.count({
        where: {
          OR: [
            {userId},
            {friendId: userId},
          ],
        },
      }),
    ]);

    return {
      friends,
      totalCount: count,
    };
  }

  async delete(sportsmanId: number, friendId: number) {
    return this.prismaService.friend.deleteMany({
      where: {
        OR: [
          {userId: sportsmanId, friendId},
          {userId: friendId, friendId: sportsmanId},
        ],
      },
    });
  }
}
