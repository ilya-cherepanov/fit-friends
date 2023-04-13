import {PrismaService} from '../prisma/prisma.service';
import {FriendStatus} from '@fit-friends/core';
import {Prisma} from '@prisma/client';
import {
  PRISMA_NOT_FOUND_CODE,
  PRISMA_VIOLATION_OF_UNIQUENESS_CODE,
  USER_WITH_EMAIL_ALREADY_EXISTS
} from '../../constants';
import {ConflictException, NotFoundException} from '@nestjs/common';


export class FriendRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(sportsmanId: number, friendId: number) {
    return this.prismaService.user.findFirst({
      where: {
        id: sportsmanId,
        OR: [
          {
            friends: {
              some: {
                friendId,
              },
            },
          },
          {
            friendsBy: {
              some: {
                userId: friendId,
              },
            },
          },
        ],
      },
      include: {
        sportsman: true,
      },
    });
  }

  async create(sportsmanId: number, friendId: number) {
    try {
      return await this.prismaService.friend.create({
        data: {
          userId: sportsmanId,
          friendId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError
        && err.code === PRISMA_VIOLATION_OF_UNIQUENESS_CODE) {
        throw new ConflictException(USER_WITH_EMAIL_ALREADY_EXISTS);
      } else {
        throw err;
      }
    }
  }

  async accept(sportsmanId: number, friendId: number) {
    try {
      return this.prismaService.friend.update({
        where: {
          userId_friendId: {
            userId: sportsmanId,
            friendId
          },
        },
        data: {
          status: FriendStatus.Accepted,
        },
        include: {
          user: true,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError
        && err.code === PRISMA_NOT_FOUND_CODE) {
        throw new NotFoundException();
      } else {
        throw err;
      }
    }
  }

  async reject(sportsmanId: number, friendId: number) {
    try {
      return this.prismaService.friend.delete({
        where: {
          userId_friendId: {
            userId: sportsmanId,
            friendId,
          },
        }
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError
        && err.code === PRISMA_NOT_FOUND_CODE) {
        throw new NotFoundException();
      } else {
        throw err;
      }
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
                  userId,
                },
              },
            },
            {
              friends: {
                some: {
                  friendId: userId,
                },
              },
            }
          ],
        },
        include: {
          sportsman: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
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
