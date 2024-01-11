import { Injectable } from '@nestjs/common';
import { PostSharedRepository } from './post-shared.repository';
import { PostShared } from './post-shared.entity';

@Injectable()
export class PostSharedService {
  constructor(private postSharedRepository: PostSharedRepository) {}

  async createShared(userId: string, postId: string) {
    const data: PostShared = {
      userId,
      postId,
    };

    return this.postSharedRepository.create(data);
  }

  async getPostSharedCursor(take: number, lastCursor: string, userId: string) {
    const post = await this.postSharedRepository.cursor(
      take,
      lastCursor,
      userId,
    );

    return post;
  }

  async deleteShared(userId: string, postId: string) {
    const like = await this.postSharedRepository.findByUserPost(userId, postId);

    console.log('like', like);

    return this.postSharedRepository.delete(like.id);
  }

  async deleteSharedByPostId(postId: string) {
    return this.postSharedRepository.deleteByPost(postId);
  }
}
