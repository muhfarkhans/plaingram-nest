import { BadRequestException, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { Post, PostWithRelation } from './post.entity';
import { CreatePostDto } from './dto/create.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PostLikeService } from 'src/post-like/post-like.service';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { CreateCommentDto } from 'src/post-comment/dto/create.dto';
import { PostBookmarkService } from 'src/post-bookmark/post-bookmark.service';
import { SearchDto } from './dto/search.dto';
import { PostSharedService } from 'src/post-shared/post-shared.service';
import { PostComment } from 'src/post-comment/post-comment.entity';
import { PostParentService } from 'src/post-parent/post-parent.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private cloudinary: CloudinaryService,
    private postLikeService: PostLikeService,
    private postCommentService: PostCommentService,
    private postBookmarkService: PostBookmarkService,
    private postSharedService: PostSharedService,
    private postParentService: PostParentService,
  ) {}

  private formatterPost(
    post: PostWithRelation,
    limitComment: number = 5,
    userId?: string,
    commentId?: string,
  ) {
    delete post.User.password;
    delete post.User.refreshToken;
    if (post.PostParent.length > 0) {
      delete post.PostParent[0].PostAsParent.User.password;
      delete post.PostParent[0].PostAsParent.User.refreshToken;
    }

    if (userId) {
      let liked = post?.PostLiked.find((item) => item.userId == userId);
      let bookmarked = post?.PostBookmark?.find(
        (item: any) => item.userId == userId,
      );

      post.is_liked = Boolean(liked);
      post.is_bookmark = Boolean(bookmarked);
    } else {
      post.is_liked = false;
      post.is_bookmark = false;
    }

    const filterComments: PostComment[] = [];
    if (post.PostComment.length > 0) {
      post.PostComment.forEach((item: any, index: number) => {
        delete item.User.password;
        delete item.User.refreshToken;

        if (commentId != '') {
          if (commentId == item.id) {
            filterComments.push(item);
            console.log(commentId, ' == ', item.id);
          }
        }
      });
    }

    post.LikesTotal = post.PostLiked.length;
    post.CommentsTotal = post.PostComment.length;
    post.SharedTotal = post.PostShared.length;

    const newestComment = post.PostComment.slice(0, limitComment);
    post.PostComment = newestComment;

    if (commentId != null) post.PostComment = filterComments;

    return post;
  }

  async getPost() {
    const post = await this.postRepository.findAll();
    return post;
  }

  async getPostCursor(
    take: number,
    lastCursor: string,
    userId?: string,
    isFilterUser?: boolean,
  ) {
    let post: PostWithRelation[];
    if (isFilterUser) {
      post = await this.postRepository.cursor(take, lastCursor, userId);
    } else {
      post = await this.postRepository.cursor(take, lastCursor);
    }

    post.forEach((item) => {
      let formattingPost = this.formatterPost(item, 3, userId);
      item = formattingPost;
    });

    return post;
  }

  async getUserPost(userId: string) {
    const post = await this.postRepository.findByUserId(userId);
    return post;
  }

  async getAllTag() {
    const tags = await this.postRepository.findAllTag();
    return tags;
  }

  async getSearchPost(
    take: number,
    lastCursor: string,
    dto: SearchDto,
    userId?: string,
  ) {
    const post = await this.postRepository.findByKeyword(
      take,
      lastCursor,
      dto.q,
      dto.tag,
    );

    post.forEach((item) => {
      let formattingPost = this.formatterPost(item, 3, userId);
      item = formattingPost;
    });

    return post;
  }

  async findPost(id: string, userId?: string) {
    const post = await this.postRepository.findById(id);
    let formattingPost = this.formatterPost(post, 10, userId);

    return formattingPost;
  }

  async createPost(
    userId: string,
    dto: CreatePostDto,
    file: Express.Multer.File | undefined,
  ) {
    const post: Post = {
      userId: userId,
      title: dto.title,
      content: dto.content,
      tag: dto.tag,
      is_shared: 0,
    };

    let create = await this.postRepository.create(post);

    if (file) {
      const image = await this.cloudinary.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      create.thumbnail = image.secure_url;
      create = await this.postRepository.update(userId, create.id, create);
    }

    return create;
  }

  async createPostShared(userId: string, postId: string) {
    const post = await this.postRepository.findById(postId);

    const postData: Post = {
      userId: userId,
      is_shared: 1,
      postId: post.id,
      title: post.title,
      content: post.content,
      tag: post.tag,
    };

    const create = await this.postRepository.create(postData);
    const createShared = await this.postSharedService.createShared(
      userId,
      post.id,
    );
    const createParent = await this.postParentService.createShared(
      postId,
      create.id,
    );

    return create;
  }

  async updatePost(userId: string, id: string, dto: CreatePostDto) {
    const post: Post = {
      userId: userId,
      title: dto.title,
      content: dto.content,
      tag: dto.tag,
      is_shared: 0,
    };

    const update = await this.postRepository.update(userId, id, post);

    return update;
  }

  async deletePost(userId: string, id: string) {
    const post = await this.postRepository.findById(id, userId);
    if (!post) return <Post>{};

    if (post.is_shared) {
      this.postSharedService.deleteShared(userId, post.id);
    } else {
      this.postSharedService.deleteSharedByPostId(post.id);
    }
    const deletePost = await this.postRepository.delete(id);

    return deletePost;
  }

  async getLikeCursor(take: number, lastCursor: string, userId: string) {
    const posts: Array<PostWithRelation> = [];
    const post = await this.postLikeService.getPostLikeCursor(
      take,
      lastCursor,
      userId,
    );

    post.forEach((item: any) => {
      let formattingPost = this.formatterPost(item.Post, 3, userId);
      posts.push(formattingPost);
    });

    return posts;
  }

  async likePost(userId: string, id: string) {
    const post = await this.findPost(id);
    if (!post) throw new BadRequestException('Post not found');

    return this.postLikeService.createLike(userId, id);
  }

  async unlikePost(userId: string, id: string) {
    const post = await this.findPost(id, userId);
    if (!post) throw new BadRequestException('Post not found');

    return this.postLikeService.deleteLike(userId, id);
  }

  async getBookmarkCursor(take: number, lastCursor: string, userId: string) {
    const posts: Array<PostWithRelation> = [];
    const post = await this.postBookmarkService.getPostBookmarkCursor(
      take,
      lastCursor,
      userId,
    );

    post.forEach((item: any) => {
      let formattingPost = this.formatterPost(item.Post, 3, userId);
      posts.push(formattingPost);
    });

    return posts;
  }

  async bookmarkPost(userId: string, id: string) {
    const post = await this.findPost(id);
    if (!post) throw new BadRequestException('Post not found');

    return this.postBookmarkService.createBookmark(userId, id);
  }

  async unBookmarkPost(userId: string, id: string) {
    const post = await this.findPost(id, userId);
    if (!post) throw new BadRequestException('Post not found');

    return this.postBookmarkService.deleteBookmark(userId, id);
  }

  async getAllCommentCursor(take: number, lastCursor: string, userId: string) {
    const post = await this.postCommentService.getPostCommentCursor(
      take,
      lastCursor,
      userId,
    );

    post.forEach((item: any) => {
      let formattingPost = this.formatterPost(item.Post, 3, userId, item.id);
      item = formattingPost;
    });

    return post;
  }

  async getComment(postId: string, take: number, lastCursor: string) {
    return this.postCommentService.getCommentByPostId(postId, lastCursor, take);
  }

  async commentPost(dto: CreateCommentDto, postId: string, userId: string) {
    const post = await this.findPost(postId);
    if (!post) throw new BadRequestException('Post not found');

    return this.postCommentService.createComment(dto, postId, userId);
  }

  async deleteComment(commentId: string, userId: string, postId: string) {
    const post = await this.findPost(postId);
    if (!post) throw new BadRequestException('Post not found');

    return this.postCommentService.deleteComment(commentId, userId, commentId);
  }
}
