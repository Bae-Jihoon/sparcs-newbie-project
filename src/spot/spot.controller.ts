import {Body, Controller, Post, Query, Req, UseGuards} from '@nestjs/common';
import {SpotService} from "./spot.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Request} from "express";

@Controller('spots')
export class SpotController {
    constructor(private readonly spotService: SpotService) {}

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

}
