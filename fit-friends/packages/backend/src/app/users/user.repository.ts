import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: {id},
      include: {
        sportsman: true,
        coach: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {email},
      include: {
        sportsman: true,
        coach: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async saveRefreshToken(userId: number, refreshToken: string | null) {
    return this.prismaService.user.update({
      where: {id: userId},
      data: {
        refreshToken,
      }
    });
  }
}
