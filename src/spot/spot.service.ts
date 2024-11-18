import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {ReverseGeocodingService} from "../geocode/reverse-geocoding.service";

@Injectable()
export class SpotService {
    constructor(
        private prisma: PrismaService,
        private rev_geocodingService: ReverseGeocodingService,
    ) {}
    async createSpot(
        userId: number,
        spotData: { name: string; description: string },
        latitude: number,
        longitude: number,
    ) {
        const roadAddress=await this.rev_geocodingService.getAddress(
            latitude,
            longitude
        );

        return this.prisma.spot.create({
            data: {
                author: {
                    connect: { id: userId}
                },
                name: spotData.name,
                description: spotData.description,
                latitude: latitude,
                longitude: longitude,
                roadAddress: roadAddress,
                sharelink: `http://localhost:3000/spots/${Math.random().toString(36).substring(2, 10)}`
            }
        })
    }
}
