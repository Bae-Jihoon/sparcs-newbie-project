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
import {FilesInterceptor} from "@nestjs/platform-express";
import { S3Service } from '../../services/s3.service';
import {CreatePostDto} from "../../common/dto/create-post.dto";
import {UpdatePostDto} from "../../common/dto/update-post.dto";
import {GetPostsDto} from "../../common/dto/get-posts.dto";
import {CreateCommentDto} from "../../common/dto/create-comment.dto";
import {UpdateCommentDto} from "../../common/dto/update-comment.dto";
import {UserData} from "../../common/types/user-data.interface";
import {JWTUser} from "../../common/decorators/jwt-user.decorator";
import {ApiCookieAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Post')
@Controller('posts')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly s3Service: S3Service

    ) {}

    //POST-001 (게시물 조회)
    @Get()
    @ApiOperation({ summary: 'Get posts' })
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
    @ApiCookieAuth()
    @Post()
    @UseInterceptors(FilesInterceptor('files', 5))
    @ApiOperation({ summary: 'Create post' })
    async createPost(
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
    @ApiOperation({ summary: 'Get post' })
    async getPostById(@Param('id') id: string) {
        return this.postService.getPost({ id: Number(id) });
    }

    //POST-004 (특정 게시물 수정)
    @UseGuards(JwtAuthGuard)
    @ApiCookieAuth()
    @Put('/:id')
    @UseInterceptors(FilesInterceptor('files', 5))
    @ApiOperation({ summary: 'Update post' })
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
    @ApiCookieAuth()
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete post' })
    async deletePost(
        @Param('id') id: string,
        @JWTUser() user: UserData
    ): Promise<PostModel> {
        const userId = Number(user.userId);
        return this.postService.deletePost( +id, userId );
    }

    //POST-006 (특정 게시물 '추천' 추가)
    @UseGuards(JwtAuthGuard)
    @ApiCookieAuth()
    @Post('/:id/likes')
    @ApiOperation({ summary: 'Add like to post' })
    async addLikePost(
        @Param('id') id: string,
        @JWTUser() user: UserData
    ) {
        const userId = Number(user.userId);
        return this.postService.addLikePost(+id, userId);
    }

    //POST-007 (특정 게시물 '추천' 제거)
    @UseGuards(JwtAuthGuard)
    @ApiCookieAuth()
    @Delete('/:id/likes')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete like of post' })
    async deleteLikePost(
        @Param('id') id: string,
        @JWTUser() user: UserData
    ) {
        const userId = Number(user.userId);
        return this.postService.deleteLikePost(+id, userId);
    }

    //POST-008 (특정 게시물 댓글 목록 조회)
    @Get('/:postId/comments')
    @ApiOperation({ summary: 'Get comments' })
    async getComments(@Param('postId') postId: string) {
        return this.postService.getComments(+postId);
    }

    //POST-009 (특정 게시물 댓글 작성)
    @UseGuards(JwtAuthGuard)
    @ApiCookieAuth()
    @Post('/:postId/comments')
    @ApiOperation({ summary: 'Create comment' })
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
    @ApiCookieAuth()
    @Put('/comments/:commentId')
    @ApiOperation({ summary: 'Update comment' })
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
    @ApiCookieAuth()
    @Delete('/comments/:commentId')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete comment' })
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
    @ApiCookieAuth()
    @Post('/comments/:commentId/likes')
    @ApiOperation({ summary: 'Add like to comment' })
    async addLikeComment(
        @Param('commentId') commentId: string,
        @JWTUser() user: UserData
    ) {
        const userId = Number(user.userId);
        return this.postService.addLikeComment(+commentId, userId);
    }

    //POST-014 (특정 댓글 '추천' 제거)
    @UseGuards(JwtAuthGuard)
    @ApiCookieAuth()
    @Delete('/comments/:commentId/likes')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete like of comment' })
    async deleteLikeComment(
        @Param('commentId') commentId: string,
        @JWTUser() user: UserData
    ) {
        const userId = Number(user.userId);
        return this.postService.deleteLikeComment(+commentId, userId);
    }
}
