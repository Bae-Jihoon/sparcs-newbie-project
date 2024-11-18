import {Body, Controller, Get, Param, Put, Req, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Request} from "express";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    //USER-001 (특정 사용자 정보 조회)
    @UseGuards(JwtAuthGuard)
    @Get()
    async getUser(
        @Req() req: Request
    ) {
        const userId=req.user.userId;
        return this.userService.getUser(userId);
    }

    //USER-002 (특정 사용자 정보 수정)
    @UseGuards(JwtAuthGuard)
    @Put()
    async updateUser(
        @Req() req: Request,
        @Body() userData: { email?: string; nickname?: string, password?: string, startedAt?: Date }
    ) {
        const userId=req.user.userId;
        return this.userService.updateUser(userId, userData);
    }

    //USER-003 (특정 사용자가 게시한 글 목록 조회)
    @UseGuards(JwtAuthGuard)
    @Get('me/posts')
    async getMyPosts(@Req() req: Request) {
        const currentUserId = req.user.userId;
        return this.userService.getPostsOfUser(currentUserId);
    }

    //(USER-003 연장) (다른 사용자가 특정 사용자의 글 조회)
    @Get(':userId/posts')
    async getPostsOfUser(@Param('userId') userId: string) {
        return this.userService.getPostsOfUser(+userId);
    }

    //USER-004 (특정 사용자가 작성한 댓글 목록 조회)
    @UseGuards(JwtAuthGuard)
    @Get('me/comments')
    async getCommentsOfUser(@Req() req:Request) {
        const userId=req.user.userId;
        return this.userService.getCommentsOfUser(userId)
    }

    //USER-005 (특정 사용자가 등록한 흡연 스팟 목록 조회)
    @UseGuards(JwtAuthGuard)
    @Get('me/spots')
    async getMySpots(@Req() req: Request) {
        const currentUserId = req.user.userId;
        return this.userService.getSpotsOfUser(currentUserId);
    }

    //(USER-005 연장) (다른 사용자가 특정 사용자의 흡연 스팟 목록 조회)
    @Get(':userId/spots')
    async getSpotsOfUser(@Param('userId') userId: string) {
        return this.userService.getSpotsOfUser(+userId);
    }

    //USER-006
    @UseGuards(JwtAuthGuard)
    @Get('me/spotcomments')
    async getSpotCommentsOfUser(@Req() req:Request) {
        const userId=req.user.userId;
        return this.userService.getSpotCommentsOfUser(userId)
    }
}
