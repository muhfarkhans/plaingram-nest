import { PostComment } from './post-comment.entity';

export interface IPostCommentRepository {
  create(data: PostComment): Promise<PostComment>;
  cursor(
    take: number,
    lastCursor: string,
    userId?: string,
  ): Promise<PostComment[]>;
  findById(commentId: string): Promise<PostComment>;
  findByPostId(
    postId: string,
    lastCursor?: string,
    take?: number,
  ): Promise<PostComment[]>;
  delete(
    commentId: string,
    userId: string,
    postId: string,
  ): Promise<PostComment>;
}
