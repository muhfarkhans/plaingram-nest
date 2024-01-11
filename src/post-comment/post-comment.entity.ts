import { User } from 'src/user/user.entity';

export interface PostComment {
  id?: string;
  userId: string;
  postId: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostCommentWithRelation extends PostComment {
  User?: User;
}
