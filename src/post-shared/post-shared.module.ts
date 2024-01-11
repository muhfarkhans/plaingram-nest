import { Module } from '@nestjs/common';
import { PostSharedService } from './post-shared.service';
import { PostSharedRepository } from './post-shared.repository';

@Module({
  providers: [PostSharedService, PostSharedRepository],
  exports: [PostSharedService],
})
export class PostSharedModule {}
