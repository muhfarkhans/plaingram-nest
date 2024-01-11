import { PostBookmark } from 'src/post-bookmark/post-bookmark.entity';
import { PostComment } from 'src/post-comment/post-comment.entity';
import { PostLike } from 'src/post-like/post-like.entity';
import { PostParentWithRelation } from 'src/post-parent/post-parent.entity';
import { PostShared } from 'src/post-shared/post-shared.entity';
import { User } from 'src/user/user.entity';

export interface Post {
  id?: string;
  userId: string;
  title: string;
  content: string;
  tag: string;
  thumbnail?: string;
  postId?: string;
  is_shared: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostWithRelation extends Post {
  User: User;
  is_liked?: boolean;
  PostLiked?: PostLike[];
  LikesTotal?: number;
  PostComment?: PostComment[];
  CommentsTotal?: number;
  is_bookmark?: boolean;
  PostBookmark?: PostBookmark[];
  PostShared?: PostShared[];
  SharedTotal?: number;
  PostParent?: PostParentWithRelation[];
  PostAsParent?: PostParentWithRelation[];
}
