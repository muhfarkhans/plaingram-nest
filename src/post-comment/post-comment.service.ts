import { Injectable } from '@nestjs/common';
import { PostCommentRepository } from './post-comment.repository';
import { PostComment } from './post-comment.entity';
import { CreateCommentDto } from './dto/create.dto';

@Injectable()
export class PostCommentService {
  constructor(private postCommentRepository: PostCommentRepository) {}

  async createComment(dto: CreateCommentDto, postId: string, userId: string) {
    const comment: PostComment = {
      userId,
      postId,
      comment: dto.comment,
    };
    return this.postCommentRepository.create(comment);
  }

  async getPostCommentCursor(take: number, lastCursor: string, userId: string) {
    const post = await this.postCommentRepository.cursor(
      take,
      lastCursor,
      userId,
    );

    return post;
  }

  async deleteComment(commentId: string, userId: string, postId: string) {
    return this.postCommentRepository.delete(commentId, userId, postId);
  }

  async getCommentByPostId(
    postId: string,
    lastCursor: string,
    take: number,
  ): Promise<PostComment[]> {
    const comments = await this.postCommentRepository.findByPostId(
      postId,
      lastCursor,
      take,
    );

    comments.forEach((item: any) => {
      delete item.User.password;
      delete item.User.refreshToken;
    });

    return comments;
  }
}
