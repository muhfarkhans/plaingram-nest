import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPostLikeRepository } from './post-like.repository.interface';
import { PostLike } from './post-like.entity';

@Injectable()
export class PostLikeRepository implements IPostLikeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: PostLike): Promise<PostLike> {
    const postLiked = await this.findByUserPost(data.userId, data.postId);
    if (postLiked) return postLiked;
    return this.prisma.postLiked.create({ data });
  }

  async cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostLike[]> {
    let result = await this.prisma.postLiked.findMany({
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

  findByUserPost(userId: string, postId: string): Promise<PostLike> {
    return this.prisma.postLiked.findFirst({
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
  ): Promise<PostLike> {
    return this.prisma.postLiked.findFirst({
      where: {
        id: likeId,
        postId,
        userId,
      },
    });
  }

  async delete(id: string): Promise<PostLike> {
    return this.prisma.postLiked.delete({
      where: { id },
    });
  }
}
