import { Post as PostModel } from ".prisma/client";
import { PostService } from "./post.service";
import { Request } from "express";
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    getPosts(keyword?: string, searchType?: string, page?: number, limit?: number, sortField?: 'createdAt' | 'likenum' | 'commentnum', sortBy?: 'asc' | 'desc'): Promise<any[]>;
    createPOST(files: Express.Multer.File[], postData: {
        title: string;
        content: string;
    }, req: Request): Promise<PostModel>;
    getPostById(id: string): Promise<PostModel>;
    updatePost(id: string, files: Express.Multer.File[], postData: {
        title?: string;
        content?: string;
    }, req: Request): Promise<PostModel>;
    deletePost(id: string, req: Request): Promise<PostModel>;
    addLikePost(id: string, req: Request): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        content: string;
        updatedAt: Date;
        likenum: number;
        commentnum: number;
        authorId: number;
    }>;
    deleteLikePost(id: string, req: Request): Promise<void>;
    getComments(postId: string): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        likenum: number;
        author: {
            nickname: string;
            createdAt: Date;
        };
        parentId: number;
    }[]>;
    createComment(postId: string, commentData: {
        content: string;
        parentId?: number;
    }, req: Request): Promise<void>;
    updateComment(commentId: string, commentData: {
        content: string;
    }, req: Request): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        updatedAt: Date;
        likenum: number;
        authorId: number;
        postId: number;
        parentId: number | null;
    }>;
    deleteComment(commentId: string, req: Request): Promise<void>;
    addLikeComment(commentId: string, req: Request): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        updatedAt: Date;
        likenum: number;
        authorId: number;
        postId: number;
        parentId: number | null;
    }>;
    deleteLikeComment(commentId: string, req: Request): Promise<void>;
}
