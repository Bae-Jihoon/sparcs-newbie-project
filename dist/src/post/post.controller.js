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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("./post.service");
const jwt_auth_guard_1 = require("../jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let PostController = class PostController {
    constructor(postService) {
        this.postService = postService;
    }
    async getPosts(keyword, searchType = 'title+content', page = 1, limit = 20, sortField = 'createdAt', sortBy = 'desc') {
        const where = {};
        if (keyword) {
            if (searchType == 'title') {
                where.title = { contains: keyword };
            }
            else if (searchType == 'content') {
                where.content = { contains: keyword };
            }
            else if (searchType == 'title+content') {
                where.OR = [
                    { title: { contains: keyword } },
                    { content: { contains: keyword } },
                ];
            }
        }
        const posts = await this.postService.getPosts(page, limit, sortField, sortBy, where);
        return posts.map(post => ({
            id: post.id,
            title: post.title,
            author: post.author.nickname,
            createdAt: post.createdAt,
            viewCount: post.commentnum,
            likeNum: post.likenum,
        }));
    }
    async createPOST(files, postData, req) {
        const { title, content } = postData;
        const userId = req.user.userId;
        const filePaths = files ? files.map(file => (0, path_1.join)(__dirname, `../../postImages/${file.filename}`)) : [];
        return this.postService.createPost({ title, content, userId }, filePaths);
    }
    async getPostById(id) {
        return this.postService.getPost({ id: Number(id) });
    }
    async updatePost(id, files, postData, req) {
        const userId = req.user.userId;
        const filePaths = files ? files.map(file => `../../postImages/${file.filename}`) : [];
        return this.postService.updatePost(userId, { id: Number(id), title: postData.title, content: postData.content }, filePaths);
    }
    async deletePost(id, req) {
        const userId = req.user.userId;
        return this.postService.deletePost(Number(id), userId);
    }
    async addLikePost(id, req) {
        const userId = req.user.userId;
        return this.postService.addLikePost(Number(id), userId);
    }
    async deleteLikePost(id, req) {
        const userId = req.user.userId;
        return this.postService.deleteLikePost(Number(id), userId);
    }
    async getComments(postId) {
        return this.postService.getComments(Number(postId));
    }
    async createComment(postId, commentData, req) {
        const authorId = req.user.userId;
        return this.postService.createComment(Number(postId), { authorId: authorId, content: commentData.content, parentId: commentData.parentId });
    }
    async updateComment(commentId, commentData, req) {
        const userId = req.user.userId;
        return this.postService.updateComment(userId, Number(commentId), commentData.content);
    }
    async deleteComment(commentId, req) {
        const userId = req.user.userId;
        return this.postService.deleteComment(userId, Number(commentId));
    }
    async addLikeComment(commentId, req) {
        const userId = req.user.userId;
        return this.postService.addLikeComment(Number(commentId), userId);
    }
    async deleteLikeComment(commentId, req) {
        const userId = req.user.userId;
        return this.postService.deleteLikeComment(Number(commentId), userId);
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('keyword')),
    __param(1, (0, common_1.Query)('searchType')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('sortField')),
    __param(5, (0, common_1.Query)('sortBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPosts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(__dirname, '../../../postImages'),
            filename: (req, file, callback) => {
                const suffix = Date.now() + '-' + req.user.email;
                const filename = `${suffix}-${file.originalname}`;
                callback(null, filename);
            }
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPOST", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(__dirname, '../../../postImages'),
            filename: (req, file, callback) => {
                const suffix = Date.now() + '-' + req.user.email;
                const filename = `${suffix}-${file.originalname}`;
                callback(null, filename);
            }
        }),
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:id/likes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "addLikePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/:id/likes'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deleteLikePost", null);
__decorate([
    (0, common_1.Get)('/:postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getComments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/comments/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updateComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/comments/:commentId'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/comments/:commentId/likes'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "addLikeComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/comments/:commentId/likes'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deleteLikeComment", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
//# sourceMappingURL=post.controller.js.map