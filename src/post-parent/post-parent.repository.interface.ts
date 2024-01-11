import { PostParent } from './post-parent.entity';

export interface IPostParentRepository {
  create(data: PostParent): Promise<PostParent>;
  cursor(take: number, lastCursor: string): Promise<PostParent[]>;
  findByPostId(postId: string): Promise<PostParent>;
  delete(id: string): Promise<PostParent>;
  deleteByPost(postId: string): Promise<{ count: number }>;
}
