import {
    Body,
    Query,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFiles,
    Put,
    HttpCode
} from '@nestjs/common';
import {Post as PostModel, Prisma} from ".prisma/client";
import {PostService} from "./post.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { Request } from "express";
import {FilesInterceptor} from "@nestjs/platform-express";
import { S3Service } from '../../services/s3.service';
import {diskStorage} from "multer";
import {join} from 'path';
import {CreatePostDto} from "../../common/dto/create-post.dto";
import {UpdatePostDto} from "../../common/dto/update-post.dto";
import {GetPostsDto} from "../../common/dto/get-posts.dto";
import {CreateCommentDto} from "../../common/dto/create-comment.dto";
import {UpdateCommentDto} from "../../common/dto/update-comment.dto";
import {UserData} from "../../common/types/user-data.interface";
import {JWTUser} from "../../common/decorators/jwt-user.decorator";

@Controller('posts')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly s3Service: S3Service

    ) {}

    //POST-001 (게시물 조회)
    @Get()
    async getPosts(@Query() query: GetPostsDto): Promise<any[]> {
        const { keyword, searchType, page, limit, sortField, sortBy } = query;

        // Where 조건 생성
        const where: Prisma.PostWhereInput = {};

        if (keyword) {
            if (searchType=='title') {
                where.title={ contains: keyword };
            } else if (searchType=='content') {
                where.content={ contains: keyword };
            } else if (searchType=='title+content') {
                where.OR=[
                    {title: { contains: keyword }},
                    {content: { contains: keyword }},
                ];
            }
        }

        const posts = await this.postService.getPosts(page, limit, sortField, sortBy, where);

        return posts.map((post) => ({
            id: post.id,
            title: post.title,
            author: post.author.nickname,
            createdAt: post.createdAt,
            viewCount: post.commentnum,
            likeNum: post.likenum,
        }));
    }

    //POST-002 (게시물 작성)
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('files', 5))
    async createPOST(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() postData: CreatePostDto,
        @JWTUser() user: UserData,
    ) {
        const { title, content } = postData;
        const userId = Number(user.userId)

        const filePaths = files
            ? await Promise.all(files.map(file => this.s3Service.uploadFile(file)))
            : [];

        return this.postService.createPost(
            { title, content, userId},
            filePaths
        )
    }

    //POST-003 (특정 게시물 조회)
    @Get('/:id')
    async getPostById(@Param('id') id: string) {
        return this.postService.getPost({ id: Number(id) });
    }

    //POST-004 (특정 게시물 수정)
    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    @UseInterceptors(FilesInterceptor('files', 5))
    async updatePost(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() postData: UpdatePostDto,
        @JWTUser() user: UserData,
    ) {
        const userId = Number(user.userId);

        const newFilePaths = files
            ? await Promise.all(files.map(file => this.s3Service.uploadFile(file)))
            : [];

        return this.postService.updatePost(
            userId,
            +id,
            { title: postData.title, content: postData.content },
            newFilePaths,
        );
    }

    //POST-005 (특정 게시물 삭제)
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deletePost(
        @Param('id') id: string,
        @JWTUser() user: UserData
    ): Promise<PostModel> {
        const userId = Number(user.userId);
        return this.postService.deletePost( +id, userId );
    }

    //POST-006 (특정 게시물 '추천' 추가)
    @UseGuards(JwtAuthGuard)
    @Post('/:id/likes')
    async addLikePost(
        @Param('id') id: string,
        @JWTUser() user: UserData
    ) {
        const userId = Number(user.userId);
        return this.postService.addLikePost(+id, userId);
    }

    //POST-007 (특정 게시물 '추천' 제거)
    @UseGuards(JwtAuthGuard)
    @Delete('/:id/likes')
    @HttpCode(204)
    async deleteLikePost(
        @Param('id') id: string,
        @JWTUser() user: UserData
    ) {
        const userId = Number(user.userId);
        return this.postService.deleteLikePost(+id, userId);
    }

    //POST-008 (특정 게시물 댓글 목록 조회)
    @Get('/:postId/comments')
    async getComments(@Param('postId') postId: string) {
        return this.postService.getComments(+postId);
    }

    //POST-009 (특정 게시물 댓글 작성)
    @UseGuards(JwtAuthGuard)
    @Post('/:postId/comments')
    async createComment(
        @Param('postId') postId: string,
        @Body() commentData: CreateCommentDto,
        @JWTUser() user: UserData
    ) {
        const authorId = Number(user.userId);
        return this.postService.createComment(
            +postId,
            { authorId: authorId, content: commentData.content, parentId: commentData.parentId },
        );
    }

    //POST-011 (특정 댓글 수정)
    @UseGuards(JwtAuthGuard)
    @Put('/comments/:commentId')
    async updateComment(
        @Param('commentId') commentId: string,
        @Body() commentData: UpdateCommentDto,
        @JWTUser() user: UserData
    ) {
        const userId= Number(user.userId);
        return this.postService.updateComment(
            userId, +commentId, commentData.content
        )
    }

    //POST-012 (특정 댓글 삭제)
    @UseGuards(JwtAuthGuard)
    @Delete('/comments/:commentId')
    @HttpCode(204)
    async deleteComment(
        @Param('commentId') commentId: string,
        @JWTUser() user: UserData
    ) {
        const userId= Number(user.userId);
        return this.postService.deleteComment(
            userId, +commentId
        )
    }

    //POST-013 (특정 댓글 '추천' 추가)
    @UseGuards(JwtAuthGuard)
    @Post('/comments/:commentId/likes')
    async addLikeComment(
        @Param('commentId') commentId: string,
        @JWTUser() user: UserData
    ) {
        const userId = Number(user.userId);
        return this.postService.addLikeComment(+commentId, userId);
    }

    //POST-014 (특정 댓글 '추천' 제거)
    @UseGuards(JwtAuthGuard)
    @Delete('/comments/:commentId/likes')
    @HttpCode(204)
    async deleteLikeComment(
        @Param('commentId') commentId: string,
        @JWTUser() user: UserData
    ) {
        const userId = Number(user.userId);
        return this.postService.deleteLikeComment(+commentId, userId);
    }
}
