import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  //POST-001
  async getPosts(
      page: number,
      limit: number,
      sortField: string,
      sortBy: string,
      where?: Prisma.PostWhereInput,
  ): Promise<any[]> {
    return this.prisma.post.findMany({
      skip: (page-1)*limit,
      take: limit,
      where,
      orderBy: { [sortField]: sortBy},
      select: {
        id : true,
        title: true,
        author: {
          select: {
            nickname: true,
          },
        },
        createdAt: true,
        commentnum: true,
        likenum: true,
      }
    });
  }

  //POST-002
  async createPost(
      postData: { title: string, content: string, userId: number },
      filePaths: string[],
  ): Promise<Post> {
    const newPost = await this.prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        author: {
          connect: {id: postData.userId,},
        }
      }
    });
    if (filePaths.length > 0) {
      const imagePaths = filePaths.map(path => ({
        path: path,
        postId: newPost.id
      }));

      await this.prisma.image.createMany({
        data: imagePaths,
      });
    }


    return newPost;
  }

  //POST-003
  async getPost(
      postId: Prisma.PostWhereUniqueInput,
  ): Promise<Post> {
    return this.prisma.post.findUnique({
      where: postId,
      include: {
        author: {
          select: {
            nickname: true,
            startedAt: true,
          }
        }
      }
    });
  }

  //POST-004
  async updatePost(
      userId: number,
      postData: { id: number; title?: string; content?: string; },
      filePaths: string[],
  ): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: postData.id },
      select: { authorId: true }, // 작성자 ID만 조회
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts.');
    }
    console.log(postData);
    const updatedPost = await this.prisma.post.update({
      where: { id: postData.id },
      data: {
        title: postData.title,
        content: postData.content,
      },
    });

    if (filePaths.length > 0) {
      const imagePaths = filePaths.map(path => ({
        path: path,
        postId: updatedPost.id,
      }));

      await this.prisma.image.createMany({
        data: imagePaths,
      });
    }
    return updatedPost;
  }

  //POST-005
  async deletePost(postId: number, userId: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts.');
    }
    if (!post) {
      throw new NotFoundException(('Post not found'))
    }

    return this.prisma.post.delete({
      where: { id: postId },
    });
  }

  //POST-006
  async addLikePost(postId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existingLike = await tx.like.findUnique({
        where: {
          userId_postId: { postId: postId, userId: userId }, // composite unique constraint
        },
      });
      if (existingLike) {
        throw new HttpException('You have already recommended this post.', HttpStatus.CONFLICT);
      }

      await tx.like.create({ data: {postId: postId, userId: userId}});
      return tx.post.update({
        where: { id: postId },
        data: { likenum: {increment: 1} }
      })
    })
  }

  //POST-007
  async deleteLikePost(postId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existingLike = await tx.like.findUnique({
        where: {
          userId_postId: { postId: postId, userId: userId }, // composite unique constraint
        },
      });
      if (!existingLike) {
        throw new NotFoundException('You have not recommended this post.');
      }

      await tx.like.delete({ where: {
          userId_postId: {postId: postId, userId: userId}
        }});
      await tx.post.update({
        where: { id: postId },
        data: { likenum: {decrement: 1} }
      })
    })
  }

  //POST-008
  async getComments(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId: postId},
      select: {
        id: true,
        author: {
          select: {
            nickname: true,
            createdAt: true
          },
        },
        content: true,
        likenum: true,
        createdAt: true,
        parentId: true
      },
      orderBy: { createdAt: 'asc'}
    })
  }

  //POST-009
  async createComment(
      postId: number,
      commentData: {authorId: number, content: string, parentId?: number}
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.comment.create({
        data: {
          post: {
            connect: { id: postId }
          },
          author: {
            connect: {id: commentData.authorId }
          },
          content: commentData.content,
          parent: commentData.parentId
              ? { connect: { id: commentData.parentId } } // 부모 댓글 연결
              : undefined
        }
      })
      await tx.post.update({
        where: { id: postId },
        data: { commentnum: {increment: 1} }
      })
    })
  }

  //POST-011
  async updateComment(
      userId: number,
      commentId: number,
      content: string
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true }, // 작성자 ID만 조회
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments.');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content : content }
    });
  }

  //POST-012
  async deleteComment(userId: number, commentId: number) {
    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true, postId: true },
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      if (comment.authorId !== userId) {
        throw new ForbiddenException('You can only delete your own posts.');
      }

      const repliesCount = await tx.comment.count({
        where: {
          OR: [
            { id: commentId },
            { parentId: commentId }
          ]
        }
      });

      await tx.comment.deleteMany({
        where: { OR: [
            { id: commentId },
            { parentId: commentId },
          ]
        }
      });
      await tx.post.update({
        where: { id: comment.postId },
        data: { commentnum: {decrement: repliesCount} }
      })
    })
  }

  //POST-013
  async addLikeComment(commentId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existingLike = await tx.commentLike.findUnique({
        where: {
          userId_commentId: { userId: userId, commentId: commentId },
        },
      });
      if (existingLike) {
        throw new ConflictException('You have already recommended this comment.');
      }

      await tx.commentLike.create({ data: {commentId: commentId, userId: userId}});
      return tx.comment.update({
        where: { id: commentId },
        data: { likenum: {increment: 1} }
      })
    })
  }

  //POST-014
  async deleteLikeComment(commentId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existingLike = await tx.commentLike.findUnique({
        where: {
          userId_commentId: { userId: userId, commentId: commentId }, // composite unique constraint
        },
      });
      if (!existingLike) {
        throw new NotFoundException('You have not recommended this comment.');
      }

      await tx.commentLike.delete({ where: {
          userId_commentId: {commentId: commentId, userId: userId}
        }});
      await tx.comment.update({
        where: { id: commentId },
        data: { likenum: {decrement: 1} }
      })
    })
  }
}
