export interface PostBookmark {
  id?: string;
  userId: string;
  postId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostBookmarkWithRelation extends PostBookmark {}
