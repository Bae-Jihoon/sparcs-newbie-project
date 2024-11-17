"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PostService = class PostService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPosts(page, limit, sortField, sortBy, where) {
        return this.prisma.post.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where,
            orderBy: { [sortField]: sortBy },
            select: {
                id: true,
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
    async createPost(postData, filePaths) {
        const newPost = await this.prisma.post.create({
            data: {
                title: postData.title,
                content: postData.content,
                author: {
                    connect: { id: postData.userId, },
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
    async getPost(postId) {
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
    async updatePost(userId, postData, filePaths) {
        const post = await this.prisma.post.findUnique({
            where: { id: postData.id },
            select: { authorId: true },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own posts.');
        }
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
    async deletePost(postId, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });
        if (post.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own posts.');
        }
        if (!post) {
            throw new common_1.NotFoundException(('Post not found'));
        }
        return this.prisma.post.delete({
            where: { id: postId },
        });
    }
    async addLikePost(postId, userId) {
        return this.prisma.$transaction(async (tx) => {
            const existingLike = await tx.like.findUnique({
                where: {
                    userId_postId: { postId: postId, userId: userId },
                },
            });
            if (existingLike) {
                throw new common_1.HttpException('You have already recommended this post.', common_1.HttpStatus.CONFLICT);
            }
            await tx.like.create({ data: { postId: postId, userId: userId } });
            return tx.post.update({
                where: { id: postId },
                data: { likenum: { increment: 1 } }
            });
        });
    }
    async deleteLikePost(postId, userId) {
        return this.prisma.$transaction(async (tx) => {
            const existingLike = await tx.like.findUnique({
                where: {
                    userId_postId: { postId: postId, userId: userId },
                },
            });
            if (!existingLike) {
                throw new common_1.NotFoundException('You have not recommended this post.');
            }
            await tx.like.delete({ where: {
                    userId_postId: { postId: postId, userId: userId }
                } });
            await tx.post.update({
                where: { id: postId },
                data: { likenum: { decrement: 1 } }
            });
        });
    }
    async getComments(postId) {
        return this.prisma.comment.findMany({
            where: { postId: postId },
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
            orderBy: { createdAt: 'asc' }
        });
    }
    async createComment(postId, commentData) {
        return this.prisma.$transaction(async (tx) => {
            await tx.comment.create({
                data: {
                    postId: postId,
                    authorId: commentData.authorId,
                    content: commentData.content,
                    parentId: commentData.parentId
                }
            });
            await tx.post.update({
                where: { id: postId },
                data: { commentnum: { increment: 1 } }
            });
        });
    }
    async updateComment(userId, commentId, content) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            select: { authorId: true },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own comments.');
        }
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { content: content }
        });
    }
    async deleteComment(userId, commentId) {
        return this.prisma.$transaction(async (tx) => {
            const comment = await tx.comment.findUnique({
                where: { id: commentId },
                select: { authorId: true, postId: true },
            });
            if (!comment) {
                throw new common_1.NotFoundException('Comment not found');
            }
            if (comment.authorId !== userId) {
                throw new common_1.ForbiddenException('You can only delete your own posts.');
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
                data: { commentnum: { decrement: repliesCount } }
            });
        });
    }
    async addLikeComment(commentId, userId) {
        return this.prisma.$transaction(async (tx) => {
            const existingLike = await tx.commentLike.findUnique({
                where: {
                    userId_commentId: { userId: userId, commentId: commentId },
                },
            });
            if (existingLike) {
                throw new common_1.ConflictException('You have already recommended this comment.');
            }
            await tx.commentLike.create({ data: { commentId: commentId, userId: userId } });
            return tx.comment.update({
                where: { id: commentId },
                data: { likenum: { increment: 1 } }
            });
        });
    }
    async deleteLikeComment(commentId, userId) {
        return this.prisma.$transaction(async (tx) => {
            const existingLike = await tx.commentLike.findUnique({
                where: {
                    userId_commentId: { userId: userId, commentId: commentId },
                },
            });
            if (!existingLike) {
                throw new common_1.NotFoundException('You have not recommended this comment.');
            }
            await tx.commentLike.delete({ where: {
                    userId_commentId: { commentId: commentId, userId: userId }
                } });
            await tx.comment.update({
                where: { id: commentId },
                data: { likenum: { decrement: 1 } }
            });
        });
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostService);
//# sourceMappingURL=post.service.js.map