export interface PostParent {
  id?: string;
  postId: string;
  postParentId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostParentWithRelation extends PostParent {
  PostAsParent?: any;
  PostParent?: any;
}
