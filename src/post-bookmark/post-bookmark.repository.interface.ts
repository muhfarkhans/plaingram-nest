import { PostBookmark } from './post-bookmark.entity';

export interface IPostBookmarkRepository {
  create(data: PostBookmark): Promise<PostBookmark>;
  cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostBookmark[]>;
  findByUserPost(userId: string, postId: string): Promise<PostBookmark>;
  findByIdUserPost(
    id: string,
    userId: string,
    postId: string,
  ): Promise<PostBookmark>;
  delete(id: string): Promise<PostBookmark>;
}
