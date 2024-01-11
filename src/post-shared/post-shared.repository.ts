import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPostSharedRepository } from './post-shared.repository.interface';
import { PostShared } from './post-shared.entity';

@Injectable()
export class PostSharedRepository implements IPostSharedRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: PostShared): Promise<PostShared> {
    return this.prisma.postShared.create({ data });
  }

  async cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostShared[]> {
    let result = await this.prisma.postShared.findMany({
      take: take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      ...(userId && {
        where: {
          userId: userId,
        },
      }),
      include: {
        Post: {
          include: {
            User: true,
            PostLiked: true,
            PostComment: {
              include: {
                User: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            PostBookmark: true,
            PostShared: true,
            PostParent: {
              include: {
                PostAsParent: { include: { User: true } },
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    return result;
  }

  findByUserPost(userId: string, postId: string): Promise<PostShared> {
    return this.prisma.postShared.findFirst({
      where: {
        postId,
        userId,
      },
    });
  }

  findByIdUserPost(
    likeId: string,
    userId: string,
    postId: string,
  ): Promise<PostShared> {
    return this.prisma.postShared.findFirst({
      where: {
        id: likeId,
        postId,
        userId,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.postShared.delete({
      where: { id },
    });
  }

  async deleteByPost(postId: string): Promise<{ count: number }> {
    return this.prisma.postShared.deleteMany({
      where: { postId },
    });
  }
}
