import { Post, PostWithRelation } from './post.entity';

export interface IPostRepository {
  create(data: Post): Promise<Post>;
  cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostWithRelation[]>;
  findAll(): Promise<Post[]>;
  findLast(): Promise<Post>;
  findById(id: string, userId?: string): Promise<PostWithRelation>;
  findByUserId(userId: string): Promise<Post[]>;
  findByKeyword(
    take: number,
    lastCursor: string,
    keyword: string,
    tag?: string,
  ): Promise<PostWithRelation[]>;
  findAllTag(): Promise<any>;
  update(userId: string, id: string, data: Post): Promise<Post>;
  delete(id: string): Promise<Post>;
  rawSQL(
    limit: number,
    lastId: string,
    q?: string,
    userId?: string,
  ): Promise<any>;
}
