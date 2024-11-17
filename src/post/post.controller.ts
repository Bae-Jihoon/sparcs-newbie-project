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
    UploadedFiles, Put, HttpCode
} from '@nestjs/common';
import {Post as PostModel, Prisma} from ".prisma/client";
import {PostService} from "./post.service";
import {JwtAuthGuard} from "../jwt-auth.guard";
import { Request } from "express";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {join} from 'path';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    //POST-001 (게시물 조회)
    @Get()
    async getPosts(
        @Query('keyword') keyword?: string,
        @Query('searchType') searchType: string = 'title+content',
        @Query('page') page=1,
        @Query('limit') limit=20,
        @Query('sortField') sortField: 'createdAt' | 'likenum' | 'commentnum' = 'createdAt',
        @Query('sortBy') sortBy: 'asc' | 'desc'='desc',
    ): Promise<any[]> {
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

        const posts = await this.postService.getPosts(
            page,
            limit,
            sortField,
            sortBy,
            where,
        );
        return posts.map(post => ({
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
    @UseInterceptors(FilesInterceptor('files', 5, {
        storage: diskStorage({
            destination: join(__dirname, '../../../postImages'),
            filename: (req, file, callback) => {
                const suffix=Date.now()+'-'+req.user.email;
                const filename= `${suffix}-${file.originalname}`
                callback(null, filename)
            }
        }),
    }))
    async createPOST(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() postData: { title: string; content: string; },
        @Req() req: Request,
    ): Promise<PostModel> {
        //console.log(files);
        const { title, content } = postData;
        const userId = req.user.userId

        const filePaths = files ? files.map(file => join(__dirname, `../../postImages/${file.filename}`)) : [];

        return this.postService.createPost(
            { title, content, userId},
            filePaths
        )
    }

    //POST-003 (특정 게시물 조회)
    @Get('/:id')
    async getPostById(@Param('id') id: string): Promise<PostModel> {
        return this.postService.getPost({ id: Number(id) });
    }

    //POST-004 (특정 게시물 수정)
    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    @UseInterceptors(FilesInterceptor('files', 5, {
        storage: diskStorage({
            destination: join(__dirname, '../../../postImages'),
            filename: (req, file, callback) => {
                const suffix = Date.now() + '-' + (req.user as any).email;
                const filename = `${suffix}-${file.originalname}`;
                callback(null, filename);
            }
        }),
    }))
    async updatePost(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() postData: { title?: string; content?: string },
        @Req() req: Request,
    ): Promise<PostModel> {
        const userId = (req.user as any).userId;

        // 새로운 파일 경로 설정 (새로운 이미지가 있을 경우)
        const filePaths = files ? files.map(file => `../../postImages/${file.filename}`) : [];

        return this.postService.updatePost(
            userId,
            { id: Number(id), title: postData.title, content: postData.content },
            filePaths
        );
    }

    //POST-005 (특정 게시물 삭제)
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deletePost(
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<PostModel> {
        const userId = req.user.userId;
        return this.postService.deletePost( Number(id), userId );
    }

    //POST-006 (특정 게시물 '추천' 추가)
    @UseGuards(JwtAuthGuard)
    @Post('/:id/likes')
    async addLikePost(
        @Param('id') id: string,
        @Req() req: Request
    ) {
        const userId = req.user.userId;
        return this.postService.addLikePost(Number(id), userId);
    }

    //POST-007 (특정 게시물 '추천' 제거)
    @UseGuards(JwtAuthGuard)
    @Delete('/:id/likes')
    @HttpCode(204)
    async deleteLikePost(
        @Param('id') id: string,
        @Req() req: Request
    ) {
        const userId = req.user.userId;
        return this.postService.deleteLikePost(Number(id), userId);
    }

    //POST-008 (특정 게시물 댓글 목록 조회)
    @Get('/:postId/comments')
    async getComments(@Param('postId') postId: string) {
        return this.postService.getComments(Number(postId));
    }

    //POST-009 (특정 게시물 댓글 작성)
    @UseGuards(JwtAuthGuard)
    @Post('/:postId/comments')
    async createComment(
        @Param('postId') postId: string,
        @Body() commentData: { content: string; parentId?: number },
        @Req() req: Request
    ) {
        const authorId = req.user.userId;
        return this.postService.createComment(
            Number(postId),
            { authorId: authorId, content: commentData.content, parentId: commentData.parentId },
        );
    }

    //POST-011 (특정 댓글 수정)
    @UseGuards(JwtAuthGuard)
    @Put('/comments/:commentId')
    async updateComment(
        @Param('commentId') commentId: string,
        @Body() commentData: { content : string },
        @Req() req: Request
    ) {
        const userId= req.user.userId;
        return this.postService.updateComment(
            userId, Number(commentId), commentData.content
        )
    }

    //POST-012 (특정 댓글 삭제)
    @UseGuards(JwtAuthGuard)
    @Delete('/comments/:commentId')
    @HttpCode(204)
    async deleteComment(
        @Param('commentId') commentId: string,
        @Req() req: Request
    ) {
        const userId= req.user.userId;
        return this.postService.deleteComment(
            userId, Number(commentId)
        )
    }

    //POST-013 (특정 댓글 '추천' 추가)
    @UseGuards(JwtAuthGuard)
    @Post('/comments/:commentId/likes')
    async addLikeComment(
        @Param('commentId') commentId: string,
        @Req() req: Request
    ) {
        const userId = req.user.userId;
        return this.postService.addLikeComment(Number(commentId), userId);
    }

    //POST-014 (특정 댓글 '추천' 제거)
    @UseGuards(JwtAuthGuard)
    @Delete('/comments/:commentId/likes')
    @HttpCode(204)
    async deleteLikeComment(
        @Param('commentId') commentId: string,
        @Req() req: Request
    ) {
        const userId = req.user.userId;
        return this.postService.deleteLikeComment(Number(commentId), userId);
    }
}
