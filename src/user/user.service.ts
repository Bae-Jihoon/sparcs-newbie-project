import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //USER-001
  async getUser(
    userId: number,
  ): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: userId},
    });
  }

  //USER-002
  async updateUser(
    userId: number,
    updateData: { email?: string; nickname?: string; password?: string; startedAt?: Date },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId},
      data: {
        email: updateData.email,
        nickname: updateData.nickname,
        password: updateData.password,
        startedAt: new Date(updateData.startedAt),
      }
    });
  }

  //USER-003
  async getPostsOfUser(userId: number) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  }

  //USER-004
  async getCommentsOfUser(userId: number) {
    return this.prisma.comment.findMany({
      where: { authorId: userId },
      select: {
        postId: true,
        post: {
          select: {
            title: true,
          }
        },
        likenum: true,
        content: true,
        createdAt: true,
      },
    });
  }

  //USER-005
  async getSpotsOfUser(userId: number) {
    return this.prisma.spot.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        name: true,
        description: true,
        latitude: true,
        longitude: true,
        roadAddress: true,
        avgRate: true,
        sharelink: true,
        createdAt: true,
      },
    });
  }

  //USER-006
  async getSpotCommentsOfUser(userId: number) {
    return this.prisma.spotComment.findMany({
      where: { authorId: userId },
      select: {
        spotId: true,
        spot: {
          select: {
            name: true,
          }
        },
        rate: true,
        content: true,
        createdAt: true,
      },
    });
  }
}
