import { Injectable } from '@nestjs/common';
import { IPostBookmarkRepository } from './post-bookmark.repository.interface';
import { PostBookmark } from './post-bookmark.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostBookmarkRepository implements IPostBookmarkRepository {
  constructor(private prisma: PrismaService) {}

  create(data: PostBookmark): Promise<PostBookmark> {
    return this.prisma.postBookmark.create({ data });
  }

  async cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostBookmark[]> {
    console.log('userId', userId);
    let result = await this.prisma.postBookmark.findMany({
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
            PostShared: true,
            PostBookmark: true,
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

  findByUserPost(userId: string, postId: string): Promise<PostBookmark> {
    return this.prisma.postBookmark.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });
  }

  findByIdUserPost(
    id: string,
    userId: string,
    postId: string,
  ): Promise<PostBookmark> {
    return this.prisma.postBookmark.findFirst({
      where: {
        id: id,
        postId,
        userId,
      },
    });
  }

  delete(id: string): Promise<PostBookmark> {
    return this.prisma.postBookmark.delete({
      where: {
        id,
      },
    });
  }
}
