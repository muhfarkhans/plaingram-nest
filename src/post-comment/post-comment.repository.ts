import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPostCommentRepository } from './post-comment.repository.interface';
import { PostComment } from './post-comment.entity';

@Injectable()
export class PostCommentRepository implements IPostCommentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: PostComment): Promise<PostComment> {
    return this.prisma.postComment.create({ data });
  }

  async cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostComment[]> {
    let result = await this.prisma.postComment.findMany({
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

  findById(id: string): Promise<PostComment> {
    return this.prisma.postComment.findFirst({
      where: {
        id,
      },
    });
  }

  findByPostId(
    postId: string,
    lastCursor?: string,
    take?: number,
  ): Promise<PostComment[]> {
    return this.prisma.postComment.findMany({
      where: {
        postId: postId,
      },
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      ...(take && {
        take: take,
      }),
      include: {
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(
    commentId: string,
    userId: string,
    postId: string,
  ): Promise<PostComment> {
    return this.prisma.postComment.delete({
      where: { id: commentId },
    });
  }
}
