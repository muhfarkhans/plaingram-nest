import { PrismaService } from 'src/prisma/prisma.service';
import { Post, PostWithRelation } from './post.entity';
import { IPostRepository } from './post.repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Post): Promise<Post> {
    return this.prisma.post.create({ data });
  }

  async cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostWithRelation[]> {
    let result = await this.prisma.post.findMany({
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
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    return result;
  }

  findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  findLast(): Promise<Post> {
    return this.prisma.post.findFirst({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string, userId?: string): Promise<PostWithRelation> {
    return this.prisma.post.findUnique({
      where: { id, ...(userId && { userId: userId }) },
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
    });
  }

  findByUserId(userId: string): Promise<Post[]> {
    return this.prisma.post.findMany({ where: { userId } });
  }

  async findByKeyword(
    take: number,
    lastCursor: string,
    keyword?: string,
    tag?: string,
  ): Promise<PostWithRelation[]> {
    let result = await this.prisma.post.findMany({
      take: take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      ...(tag != '' && keyword != ''
        ? {
            where: {
              AND: [{ title: { search: keyword } }, { tag: { equals: tag } }],
            },
          }
        : {}),
      ...(!tag
        ? {
            where: {
              title: { search: keyword },
            },
          }
        : {}),
      ...(tag
        ? {
            where: {
              tag: { equals: tag },
            },
          }
        : {}),
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
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    return result;
  }

  async findAllTag(): Promise<any> {
    const result = await this.prisma.$queryRaw`
      SELECT DISTINCT tag
      FROM "Post";
    `;

    return result;
  }

  update(userId: string, id: string, data: Post): Promise<Post> {
    return this.prisma.post.update({
      where: { id, ...(userId && { userId: userId }) },
      data,
    });
  }

  delete(id: string): Promise<Post> {
    return this.prisma.post.delete({ where: { id } });
  }

  async rawSQL(limit: number, lastId: string, q?: string, userId?: string) {
    q = '%' + q + '%';

    const result = await this.prisma.$queryRaw<any>`
      SELECT
      p.*,
      COALESCE(
          (
              SELECT COUNT(pl.id)::int
              FROM "PostLiked" pl
              WHERE pl."postId" = p.id
                AND pl."userId" = ${userId}
          ), 0
      ) AS is_liked,
      COALESCE(
          (
              SELECT COUNT(pb.id)::int
              FROM "PostBookmark" pb
              WHERE pb."postId" = p.id
                AND pb."userId" = ${userId}
          ), 0
      ) AS is_bookmarked,
      COALESCE(
          (
              SELECT COUNT(pl.id)::int
              FROM "PostLiked" pl
              WHERE pl."postId" = p.id
          ), 0
      ) AS like_total,
      COALESCE(
          (
              SELECT COUNT(pc.id)::int
              FROM "PostComment" pc
              WHERE pc."postId" = p.id
          ), 0
      ) AS comment_total,
      COALESCE(
          (
              SELECT COUNT(ps.id)::int
              FROM "PostShared" ps
              WHERE ps."postId" = p.id
          ), 0
      ) AS share_total,
      (
          SELECT json_build_object(
              'id', u."id",
              'name', u."name",
              'email', u."email",
              'about', u."about",
              'avatar', u."avatar"
          )
          FROM "User" u
          WHERE u.id = p."userId"
      ) AS user,
      (
          SELECT json_agg(
              json_build_object(
                  'id', pc."id",
                  'userId', pc."userId",
                  'postId', pc."postId",
                  'comment', pc."comment",
                  'createdAt', pc."createdAt",
                  'updatedAt', pc."updatedAt",
                  'user', json_build_object(
                      'id', pc."userId",
                      'name', pc."name",
                      'email', pc."email",
                      'about', pc."about",
                      'avatar', pc."avatar"
                  )
              )
          )
          FROM (
              SELECT pc1.*, u2."name", u2."email", u2."about", u2."avatar"
              FROM "PostComment" pc1
              JOIN "User" u2 ON pc1."userId" = u2.id
              WHERE pc1."postId" = p."id"
              ORDER BY pc1."createdAt" DESC
              LIMIT 10
          ) AS pc
      ) AS comments,
      (
          SELECT json_agg(p3)
          FROM (
              SELECT p2.*,
                  COALESCE(
                      (
                          SELECT COUNT(pl.id)
                          FROM "PostLiked" pl
                          WHERE pl."postId" = p.id
                            AND pl."userId" = ${userId}
                      ), 0
                  ) AS is_liked,
                  COALESCE(
                      (
                          SELECT COUNT(pb.id)
                          FROM "PostBookmark" pb
                          WHERE pb."postId" = p.id
                            AND pb."userId" = ${userId}
                      ), 0
                  ) AS is_bookmarked,
                  COALESCE(
                      (
                          SELECT COUNT(pl.id)
                          FROM "PostLiked" pl
                          WHERE pl."postId" = p.id
                      ), 0
                  ) AS like_total,
                  COALESCE(
                      (
                          SELECT COUNT(pc.id)
                          FROM "PostComment" pc
                          WHERE pc."postId" = p.id
                      ), 0
                  ) AS comment_total,
                  COALESCE(
                      (
                          SELECT COUNT(ps.id)
                          FROM "PostShared" ps
                          WHERE ps."postId" = p.id
                      ), 0
                  ) AS share_total
              FROM "Post" p2
              WHERE p2.id = p."postId"
          ) p3
      ) AS post_parent
    FROM "Post" p
    WHERE ((
      p."createdAt" < now() 
      or 
      (p."createdAt" = now() and p."id" < ${lastId}))
      and 
      p."title" like ${q}
    )
    ORDER BY p."createdAt", p."id"
    LIMIT ${limit};
    `;

    return result;
  }
}
