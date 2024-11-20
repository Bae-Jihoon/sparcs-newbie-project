import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {SpotService} from "./spot.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Request} from "express";
import {SpotCommentDto} from "../dto/spot-comment.dto";

@Controller('spots')
export class SpotController {
    constructor(private readonly spotService: SpotService) {}

    //SPOT-001 (흡연스팟 추가)
    @UseGuards(JwtAuthGuard)
    @Post()
    async createSpot(
        @Req() req: Request,
        @Body() spotData: { name: string, description: string },
        @Query('coords') coords: string,
    ) {
        const userId = req.user.userId;
        const [longitude, latitude] = coords.split(',').map((value) => parseFloat(value));

        return this.spotService.createSpot(
            userId,
            spotData,
            latitude,
            longitude
        );
    }

    //SPOT-002 (모든 흡연스팟 조회)
    @Get()
    async getSpots(
        @Query('region')region?: string,
        @Query('searchType') searchType : string = 'address'
    ) {
        return this.spotService.getSpots(searchType, region)
    }

    //SPOT-003 (특정 흡연스팟 조회)
    @Get('/:spotId')
    async getSpot(
        @Param('spotId') spotId: string,
    ) {
        return this.spotService.getSpot(+spotId);
    }

    //SPOT-004 (특정 흡연스팟 수정)
    @UseGuards(JwtAuthGuard)
    @Put('/:spotId')
    async updateSpot(
        @Param('spotId') spotId: string,
        @Req() req: Request,
        @Body() spotData: { name?: string, description?: string },
        @Query('coords') coords?: string,
    ) {
        const userId = req.user.userId;
        console.log(spotData);
        return this.spotService.updateSpot(
            userId,
            +spotId,
            spotData,
            coords
        )
    }

    //SPOT-005 (특정 흡연스팟 삭제)
    @UseGuards(JwtAuthGuard)
    @Delete('/:spotId')
    async deleteSpot(
        @Req() req: Request,
        @Param('spotId') spotId: string,
    ) {
        const userId=req.user.userId;
        return this.spotService.deleteSpot(+spotId, userId);
    }

    //SPOT-006 (특정 흡연스팟에 대한 댓글 작성)
    @UseGuards(JwtAuthGuard)
    @Post('/:spotId/spotcomments')
    async createSpotComment(
        @Req() req: Request,
        @Param('spotId') spotId: string,
        @Body() spotCommentDto: SpotCommentDto
    ) {
        const userId=req.user.userId;
        const {content, rate} = spotCommentDto;
        return this.spotService.createSpotComment(
            userId,
            +spotId,
            rate,
            content
        )
    }

    //SPOT-007 (특정 스팟의 댓글 목록 조회)
    @Get('/:spotId/spotcomments')
    async getSpotComments(
        @Param('spotId') spotId: string,
    ) {
        return this.spotService.getSpotComments(+spotId);
    }

    //SPOT-008 (특정 스팟댓글 삭제)
    @UseGuards(JwtAuthGuard)
    @Delete('/spotcomments/:spotcommentId')
    @HttpCode(204)
    async deleteSpotComment(
        @Req() req: Request,
        @Param('spotcommentId') spotcommentId: string,
    ) {
        const userId=req.user.userId;
        return this.spotService.deleteSpotComment(userId, +spotcommentId);
    }

    //SPOT-009 (특정 스팟댓글 수정)
    @UseGuards(JwtAuthGuard)
    @Put('/spotcomments/:spotcommentId')
    async updateSpotComment(
        @Req() req: Request,
        @Param('spotcommentId') spotcommentId: string,
        @Body() spotCommentDto: SpotCommentDto
    ) {
        const userId=req.user.userId;
        return this.spotService.updateSpotComment(
            userId,
            +spotcommentId,
            spotCommentDto
        )
    }
}
