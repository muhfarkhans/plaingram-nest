import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PostLikeModule } from './post-like/post-like.module';
import { PostCommentModule } from './post-comment/post-comment.module';
import { PostBookmarkModule } from './post-bookmark/post-bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    CloudinaryModule,
    PostLikeModule,
    PostCommentModule,
    PostBookmarkModule,
  ],
})
export class AppModule {}
