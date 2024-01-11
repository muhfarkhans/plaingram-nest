import { Module } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { PostCommentRepository } from './post-comment.repository';

@Module({
  providers: [PostCommentService, PostCommentRepository],
  exports: [PostCommentService],
})
export class PostCommentModule {}
