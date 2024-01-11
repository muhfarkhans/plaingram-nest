import { Module } from '@nestjs/common';
import { PostBookmarkService } from './post-bookmark.service';
import { PostBookmarkRepository } from './post-bookmark.repository';

@Module({
  providers: [PostBookmarkService, PostBookmarkRepository],
  exports: [PostBookmarkService],
})
export class PostBookmarkModule {}
