import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPostParentRepository } from './post-parent.repository.interface';
import { PostParent } from './post-parent.entity';

@Injectable()
export class PostParentRepository implements IPostParentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: PostParent): Promise<PostParent> {
    return this.prisma.postParent.create({ data });
  }

  async cursor(take: number, lastCursor: string): Promise<PostParent[]> {
    let result = await this.prisma.postParent.findMany({
      take: take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
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

  findByPostId(postId: string): Promise<PostParent> {
    return this.prisma.postParent.findFirst({
      where: {
        postId,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.postParent.delete({
      where: { id },
    });
  }

  async deleteByPost(postId: string): Promise<{ count: number }> {
    return this.prisma.postParent.deleteMany({
      where: { postId },
    });
  }
}
