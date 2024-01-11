import { Injectable } from '@nestjs/common';
import { PostBookmarkRepository } from './post-bookmark.repository';
import { PostBookmark } from './post-bookmark.entity';

@Injectable()
export class PostBookmarkService {
  constructor(private postBookmarkRepository: PostBookmarkRepository) {}

  async createBookmark(userId: string, postId: string) {
    const data: PostBookmark = {
      userId,
      postId,
    };

    return this.postBookmarkRepository.create(data);
  }

  async getPostBookmarkCursor(
    take: number,
    lastCursor: string,
    userId: string,
  ) {
    const post = await this.postBookmarkRepository.cursor(
      take,
      lastCursor,
      userId,
    );

    return post;
  }

  async deleteBookmark(userId: string, postId: string) {
    const like = await this.postBookmarkRepository.findByUserPost(
      userId,
      postId,
    );

    return this.postBookmarkRepository.delete(like.id);
  }
}
