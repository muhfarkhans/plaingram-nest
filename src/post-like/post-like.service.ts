import { Injectable } from '@nestjs/common';
import { PostLikeRepository } from './post-like.repository';
import { PostLike } from './post-like.entity';

@Injectable()
export class PostLikeService {
  constructor(private postLikeRepository: PostLikeRepository) {}

  async createLike(userId: string, postId: string) {
    const data: PostLike = {
      userId,
      postId,
    };

    return this.postLikeRepository.create(data);
  }

  async getPostLikeCursor(take: number, lastCursor: string, userId: string) {
    const post = await this.postLikeRepository.cursor(take, lastCursor, userId);

    return post;
  }

  async deleteLike(userId: string, postId: string) {
    const like = await this.postLikeRepository.findByUserPost(userId, postId);

    return this.postLikeRepository.delete(like.id);
  }
}
