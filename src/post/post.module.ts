import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PostLikeModule } from 'src/post-like/post-like.module';
import { PostCommentModule } from 'src/post-comment/post-comment.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PostBookmarkModule } from 'src/post-bookmark/post-bookmark.module';
import { PostSharedModule } from 'src/post-shared/post-shared.module';
import { PostParentModule } from 'src/post-parent/post-parent.module';

@Module({
  imports: [
    JwtModule.register({}),
    CloudinaryModule,
    PostLikeModule,
    PostCommentModule,
    PostBookmarkModule,
    PostSharedModule,
    PostParentModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
