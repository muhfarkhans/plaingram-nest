import { Injectable } from '@nestjs/common';
import { PostParentRepository } from './post-parent.repository';
import { PostParent } from './post-parent.entity';

@Injectable()
export class PostParentService {
  constructor(private postParentRepository: PostParentRepository) {}

  async createShared(postParentId: string, postId: string) {
    const data: PostParent = {
      postId,
      postParentId,
    };

    return this.postParentRepository.create(data);
  }

  async getPostParentCursor(take: number, lastCursor: string, userId: string) {
    const post = await this.postParentRepository.cursor(take, lastCursor);

    return post;
  }

  async deleteShared(postId: string) {
    const like = await this.postParentRepository.findByPostId(postId);

    return this.postParentRepository.delete(like.id);
  }

  async deleteSharedByPostId(postId: string) {
    return this.postParentRepository.deleteByPost(postId);
  }
}
