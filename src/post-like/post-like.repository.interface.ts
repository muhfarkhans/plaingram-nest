import { PostLike } from './post-like.entity';

export interface IPostLikeRepository {
  create(data: PostLike): Promise<PostLike>;
  cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostLike[]>;
  findByUserPost(userId: string, postId: string): Promise<PostLike>;
  findByIdUserPost(
    likeId: string,
    userId: string,
    postId: string,
  ): Promise<PostLike>;
  delete(id: string): Promise<PostLike>;
}
