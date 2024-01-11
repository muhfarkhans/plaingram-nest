import { PostShared } from './post-shared.entity';

export interface IPostSharedRepository {
  create(data: PostShared): Promise<PostShared>;
  cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostShared[]>;
  findByUserPost(userId: string, postId: string): Promise<PostShared>;
  findByIdUserPost(
    likeId: string,
    userId: string,
    postId: string,
  ): Promise<PostShared>;
  delete(id: string): Promise<PostShared>;
  deleteByPost(postId: string): Promise<{ count: number }>;
}
