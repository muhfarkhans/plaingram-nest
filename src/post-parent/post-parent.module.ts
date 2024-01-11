import { Module } from '@nestjs/common';
import { PostParentService } from './post-parent.service';
import { PostParentRepository } from './post-parent.repository';

@Module({
  providers: [PostParentService, PostParentRepository],
  exports: [PostParentService],
})
export class PostParentModule {}
