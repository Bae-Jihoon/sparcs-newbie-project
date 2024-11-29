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
import {CreateSpotcommentDto} from "../../common/dto/create-spotcomment.dto";
import {CreateSpotDto} from "../../common/dto/create-spot.dto";
import {CoordsQueryDto} from "../../common/dto/coords-query.dto";
import {GetSpotsDto} from "../../common/dto/get-spots.dto";
import {UpdateSpotDto} from "../../common/dto/update-spot.dto";
import {UpdateSpotcommentDto} from "../../common/dto/update-spotcomment.dto";
import {JWTUser} from "../../common/decorators/jwt-user.decorator";
import {UserData} from "../../common/types/user-data.interface";

@Controller('spots')
export class SpotController {
    constructor(private readonly spotService: SpotService) {}

    //SPOT-001 (흡연스팟 추가)
    @UseGuards(JwtAuthGuard)
    @Post()
    async createSpot(
        @JWTUser() user: UserData,
        @Body() spotData: CreateSpotDto,
        @Query() coordsQuery: CoordsQueryDto,
    ) {
        //console.log('Received coords:', coordsQuery.coords);
        const userId = Number(user.userId);

        const [longitude, latitude] = coordsQuery.coords
            .split(',')
            .map((value) => parseFloat(value));

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
        @Query() query: GetSpotsDto
    ) {
        const { region, searchType} = query;
        return this.spotService.getSpots(searchType, region);
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
        @JWTUser() user: UserData,
        @Body() spotData: UpdateSpotDto,
    ) {
        const userId = Number(user.userId);
        return this.spotService.updateSpot(
            userId,
            +spotId,
            spotData,
        )
    }

    //SPOT-005 (특정 흡연스팟 삭제)
    @UseGuards(JwtAuthGuard)
    @Delete('/:spotId')
    async deleteSpot(
        @JWTUser() user: UserData,
        @Param('spotId') spotId: string,
    ) {
        const userId=Number(user.userId);
        return this.spotService.deleteSpot(+spotId, userId);
    }

    //SPOT-006 (특정 흡연스팟에 대한 댓글 작성)
    @UseGuards(JwtAuthGuard)
    @Post('/:spotId/spotcomments')
    async createSpotComment(
        @JWTUser() user: UserData,
        @Param('spotId') spotId: string,
        @Body() spotCommentData: CreateSpotcommentDto
    ) {
        const userId=Number(user.userId);
        const {content, rate} = spotCommentData;
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
        @JWTUser() user: UserData,
        @Param('spotcommentId') spotcommentId: string,
    ) {
        const userId=Number(user.userId);
        return this.spotService.deleteSpotComment(userId, +spotcommentId);
    }

    //SPOT-009 (특정 스팟댓글 수정)
    @UseGuards(JwtAuthGuard)
    @Put('/spotcomments/:spotcommentId')
    async updateSpotComment(
        @JWTUser() user: UserData,
        @Param('spotcommentId') spotcommentId: string,
        @Body() spotCommentData: UpdateSpotcommentDto
    ) {
        const userId=Number(user.userId);
        return this.spotService.updateSpotComment(
            userId,
            +spotcommentId,
            spotCommentData
        )
    }
}
