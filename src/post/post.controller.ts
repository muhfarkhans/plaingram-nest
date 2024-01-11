import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/user.entity';
import { CreatePostDto } from './dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from 'src/post-comment/dto/create.dto';
import { UserInterceptor } from 'src/common/interceptors/user-interceptor';
import { CreatePostShareDto } from './dto/create-post.dto';
import { SearchDto } from './dto/search.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('')
  get() {
    return this.postService.getPost();
  }

  @Get('/cursor/:take/:lastCursor?')
  @UseInterceptors(UserInterceptor)
  getCursor(
    @GetUser() user: User,
    @Param('take', ParseIntPipe) take: number,
    @Param('lastCursor') lastCursor: string,
  ) {
    return this.postService.getPostCursor(take, lastCursor, user?.id);
  }

  @UseGuards(JwtGuard)
  @Get('/own')
  getOwn(@GetUser('') user: User) {
    return this.postService.getUserPost(user.id);
  }

  @UseGuards(JwtGuard)
  @Get('/own/cursor/:take/:lastCursor?')
  getOwnCursor(
    @GetUser() user: User,
    @Param('take', ParseIntPipe) take: number,
    @Param('lastCursor') lastCursor: string,
  ) {
    return this.postService.getPostCursor(take, lastCursor, user.id, true);
  }

  @Get('/tag')
  getAllTag() {
    return this.postService.getAllTag();
  }

  @Get('/search/:take/:lastCursor?')
  @UseInterceptors(UserInterceptor)
  searchPost(
    @GetUser() user: User,
    @Param('take', ParseIntPipe) take: number,
    @Param('lastCursor') lastCursor: string,
    @Query() param: SearchDto,
  ) {
    return this.postService.getSearchPost(take, lastCursor, param, user?.id);
  }

  @Get('/:id')
  @UseInterceptors(UserInterceptor)
  find(@GetUser() user: User, @Param('id') id: string) {
    return this.postService.findPost(id, user?.id);
  }

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(
    @GetUser('') user: User,
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createPost(user.id, dto, file);
  }

  @UseGuards(JwtGuard)
  @Post('/share')
  createPostShared(@GetUser('') user: User, @Body() dto: CreatePostShareDto) {
    return this.postService.createPostShared(user.id, dto.id);
  }

  @UseGuards(JwtGuard)
  @Post('/:id')
  update(
    @GetUser('') user: User,
    @Body() dto: CreatePostDto,
    @Param('id') id: string,
  ) {
    return this.postService.updatePost(user.id, id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  delete(@GetUser('') user: User, @Param('id') id: string) {
    const post = this.postService.deletePost(user.id, id);
    return post;
  }

  @UseGuards(JwtGuard)
  @Get('/like/:take/:lastCursor?')
  getLikeCursor(
    @GetUser() user: User,
    @Param('take', ParseIntPipe) take: number,
    @Param('lastCursor') lastCursor: string,
  ) {
    return this.postService.getLikeCursor(take, lastCursor, user.id);
  }

  @UseGuards(JwtGuard)
  @Post('/:id/like')
  likePost(@GetUser('') user: User, @Param('id') id: string) {
    return this.postService.likePost(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id/like')
  unlikePost(@GetUser('') user: User, @Param('id') id: string) {
    return this.postService.unlikePost(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Get('/bookmark/:take/:lastCursor?')
  getBookmarkCursor(
    @GetUser() user: User,
    @Param('take', ParseIntPipe) take: number,
    @Param('lastCursor') lastCursor: string,
  ) {
    return this.postService.getBookmarkCursor(take, lastCursor, user.id);
  }

  @UseGuards(JwtGuard)
  @Post('/:id/bookmark')
  bookmarkPost(@GetUser('') user: User, @Param('id') id: string) {
    return this.postService.bookmarkPost(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id/bookmark')
  unBookmarkPost(@GetUser('') user: User, @Param('id') id: string) {
    return this.postService.unBookmarkPost(user.id, id);
  }

  @Get('/:id/comment/:take/:lastCursor?')
  getCommentPost(
    @Param('id') id: string,
    @Param('take', ParseIntPipe) take: number,
    @Param('lastCursor') lastCursor: string,
  ) {
    return this.postService.getComment(id, take, lastCursor);
  }

  @UseGuards(JwtGuard)
  @Get('/comment/:take/:lastCursor?')
  getAllCommentCursor(
    @GetUser() user: User,
    @Param('take', ParseIntPipe) take: number,
    @Param('lastCursor') lastCursor: string,
  ) {
    return this.postService.getAllCommentCursor(take, lastCursor, user.id);
  }

  @UseGuards(JwtGuard)
  @Post('/:id/comment')
  commentPost(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.postService.commentPost(dto, id, user.id);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id/comment/:commentid')
  deleteCommentPost(
    @GetUser() user: User,
    @Param('id') id: string,
    @Param('commentid') commentId: string,
  ) {
    return this.postService.deleteComment(commentId, user.id, id);
  }
}
