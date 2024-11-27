import {Body, Controller, Get, Param, Put, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {JWTUser} from "../../common/decorators/jwt-user.decorator";
import {UserData} from "../../common/types/user-data.interface";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    //USER-001 (특정 사용자 정보 조회)
    @UseGuards(JwtAuthGuard)
    @Get()
    async getUser(
        @JWTUser() user: UserData
    ) {
        const userId=Number(user.userId);
        return this.userService.getUser(userId);
    }

    //USER-002 (특정 사용자 정보 수정)
    @UseGuards(JwtAuthGuard)
    @Put()
    async updateUser(
        @JWTUser() user: UserData,
        @Body() userData: { email?: string; nickname?: string, password?: string, startedAt?: Date }
    ) {
        const userId=Number(user.userId);
        return this.userService.updateUser(userId, userData);
    }

    //USER-003 (특정 사용자가 게시한 글 목록 조회)
    @Get(':userId?/posts')
    @UseGuards(JwtAuthGuard)
    async getPostsOfUser(
        @Param('userId') userId: string | undefined,
        @JWTUser() user: UserData
    ) {
        const currentUserId = Number(user.userId);

        const realUserId = userId ? Number(userId) : currentUserId;
        return this.userService.getPostsOfUser(realUserId);
    }


    //USER-004 (특정 사용자가 작성한 댓글 목록 조회)
    @UseGuards(JwtAuthGuard)
    @Get('/comments')
    async getCommentsOfUser(
        @JWTUser() user: UserData
    ) {
        return this.userService.getCommentsOfUser(+user.userId);
    }


    //USER-005 (특정 사용자가 등록한 흡연 스팟 목록 조회)
    @Get(':userId?/spots')
    @UseGuards(JwtAuthGuard)
    async getSpotsOfUser(
        @Param('userId') userId: string | undefined,
        @JWTUser() user: UserData
    ) {
        const currentUserId = Number(user.userId);

        const realUserId = userId ? Number(userId) : currentUserId;
        return this.userService.getSpotsOfUser(realUserId);
    }

    //USER-006
    @UseGuards(JwtAuthGuard)
    @Get('/spotcomments')
    async getSpotCommentsOfUser(
        @JWTUser() user: UserData
    ) {
        return this.userService.getSpotCommentsOfUser(+user.userId);
    }
}
