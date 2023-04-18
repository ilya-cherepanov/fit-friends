import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateReviewDTO} from './dto/create-review.dto';


@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(authorId: number, data: CreateReviewDTO) {
    return this.prismaService.review.create({
      data: {
        authorId,
        text: data.text,
        trainingId: data.trainingId,
        rating: data.rating,
      },
      include: {
        author: {
          include: {
            sportsman: true,
          },
        },
      },
    });
  }

  async getMany(trainingId: number, skip: number, take: number) {
    const [reviews, count] = await this.prismaService.$transaction([
      this.prismaService.review.findMany({
        where: {
          trainingId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            include: {
              sportsman: true,
            },
          },
        },
        skip,
        take,
      }),
      this.prismaService.review.count({
        where: {
          trainingId,
        },
      }),
    ]);

    return {reviews, count};
  }
}
