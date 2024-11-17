import { PrismaService } from '../../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
export declare class PostService {
    private prisma;
    constructor(prisma: PrismaService);
    getPosts(page: number, limit: number, sortField: string, sortBy: string, where?: Prisma.PostWhereInput): Promise<any[]>;
    createPost(postData: {
        title: string;
        content: string;
        userId: number;
    }, filePaths: string[]): Promise<Post>;
    getPost(postId: Prisma.PostWhereUniqueInput): Promise<Post>;
    updatePost(userId: number, postData: {
        id: number;
        title?: string;
        content?: string;
    }, filePaths: string[]): Promise<Post>;
    deletePost(postId: number, userId: number): Promise<Post>;
    addLikePost(postId: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        content: string;
        updatedAt: Date;
        likenum: number;
        commentnum: number;
        authorId: number;
    }>;
    deleteLikePost(postId: number, userId: number): Promise<void>;
    getComments(postId: number): Promise<{
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
    createComment(postId: number, commentData: {
        authorId: number;
        content: string;
        parentId?: number;
    }): Promise<void>;
    updateComment(userId: number, commentId: number, content: string): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        updatedAt: Date;
        likenum: number;
        authorId: number;
        postId: number;
        parentId: number | null;
    }>;
    deleteComment(userId: number, commentId: number): Promise<void>;
    addLikeComment(commentId: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        updatedAt: Date;
        likenum: number;
        authorId: number;
        postId: number;
        parentId: number | null;
    }>;
    deleteLikeComment(commentId: number, userId: number): Promise<void>;
}
