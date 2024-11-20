import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {ReverseGeocodingService} from "../geocode/reverse-geocoding.service";

@Injectable()
export class SpotService {
    constructor(
        private prisma: PrismaService,
        private rev_geocodingService: ReverseGeocodingService,
    ) {}

    //SPOT-001
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

    //SPOT-002
    async getSpots(
        searchType:string,
        keyword?:string,
    ) {
        if (keyword) {
            if (searchType=='address') {
                return this.prisma.spot.findMany({
                    where: { roadAddress: { contains: keyword}}
                });
            }
            else if (searchType=='name') {
                return this.prisma.spot.findMany({
                    where: { name: { contains: keyword}}
                });
            }
            else if (searchType=='description') {
                return this.prisma.spot.findMany({
                    where: { description: { contains: keyword}}
                });
            }
            else {
                throw new BadRequestException('Bad Request');
            }
        }
        else {
            return this.prisma.spot.findMany();
        }
    }

    //SPOT-003
    async getSpot(spotId: number) {
        return this.prisma.spot.findUnique({
            where: { id: spotId}
        })
    }

    //SPOT-004
    async updateSpot(
        userId: number,
        spotId: number,
        spotData: { name?: string; description?: string },
        coords?: string
    ) {
        const spot = await this.prisma.spot.findUnique({
            where: { id: spotId },
            select: { authorId: true },
        });
        if (spot.authorId!=userId){
            throw new ForbiddenException('You can only update your own spots.');
        }

        const [longitude, latitude] = coords
            ? coords.split(',').map((value) => parseFloat(value))
            : [undefined, undefined];

        const roadAddress= coords
            ? await this.rev_geocodingService.getAddress(latitude, longitude)
            : undefined

        return this.prisma.spot.update({
            where: { id: spotId },
            data: {
                name: spotData.name,
                description: spotData.description,
                latitude: latitude,
                longitude: longitude,
                roadAddress: roadAddress,
            }
        })
    }

    //SPOT-005
    async deleteSpot(spotId: number, userId: number) {
        const spot = await this.prisma.spot.findUnique({
            where: { id: spotId },
            select: { authorId: true },
        });

        if (!spot) {
            throw new NotFoundException('Spot not found')
        }
        if (spot.authorId!=userId){
            throw new ForbiddenException('You can only delete your own spots.');
        }

        return this.prisma.spot.delete({
            where: { id: spotId}
        })
    }

    //SPOT-006
    async createSpotComment(
        userId: number,
        spotId: number,
        rate: number,
        content?: string,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const existingLike = await tx.spotComment.findUnique({
                where: {
                    authorId_spotId: { authorId: userId, spotId: spotId },
                },
            });
            if (existingLike) {
                throw new ConflictException('One user can post at most one comment per spot.');
            }

            await tx.spotComment.create({
                data: {
                    spot: {
                        connect: {id: spotId}
                    },
                    author: {
                        connect: {id: userId}
                    },
                    content: content,
                    rate: rate
                }
            });
            const spot = await this.prisma.spot.findUnique({
                where: { id: spotId },
                select: {
                    commentnum: true,
                    avgRate: true,
                },
            });
            const newCommentNum=spot.commentnum+1;
            const newAvgRate=(spot.commentnum*spot.avgRate+rate)/newCommentNum;
            return tx.spot.update({
                where: { id: spotId },
                data: {
                    commentnum: newCommentNum,
                    avgRate: newAvgRate
                }
            })
        })
    }

    //SPOT-007
    async getSpotComments(spotId: number) {
        return this.prisma.spotComment.findMany({
            where: { spotId: spotId }
        })
    }

    //SPOT-008
    async deleteSpotComment(userId: number, spotcommentId: number) {
        return this.prisma.$transaction(async (tx) => {
            const spotcomment=await tx.spotComment.findUnique({
                where: { id: spotcommentId },
                select: {
                    authorId: true,
                    rate: true,
                    spotId: true
                }
            });
            if (!spotcomment) {
                throw new NotFoundException('You have not written a comment for this spot yet');
            }
            if (spotcomment.authorId!=userId) {
                throw new ForbiddenException('You can only delete your own comments.');
            }

            await tx.spotComment.delete({
                where: { id: spotcommentId}
            });

            const spot = await this.prisma.spot.findUnique({
                where: { id: spotcomment.spotId },
                select: {
                    commentnum: true,
                    avgRate: true,
                },
            });
            const newCommentNum=spot.commentnum-1;
            const newAvgRate=(spot.commentnum*spot.avgRate-spotcomment.rate)/newCommentNum;
            await tx.spot.update({
                where: { id: spotcomment.spotId },
                data: {
                    commentnum: newCommentNum,
                    avgRate: newAvgRate
                }
            })
        })
    }

    //SPOT-009
    async updateSpotComment(
        userId: number,
        spotcommentId: number,
        updateData: { content?: string; rate?: number}
    ) {
        return this.prisma.$transaction(async (tx) => {
            const spotcomment=await tx.spotComment.findUnique({
                where: { id: spotcommentId },
                select: {
                    authorId: true,
                    rate: true,
                    spotId: true
                }
            });
            if (spotcomment.authorId!=userId) {
                throw new ForbiddenException('You can only modify your own comments.');
            }

            const spot = await this.prisma.spot.findUnique({
                where: { id: spotcomment.spotId},
                select: {
                    commentnum: true,
                    avgRate: true,
                }
            });

            await tx.spotComment.update({
                where: { id: spotcommentId},
                data: {
                    content: updateData.content,
                    rate: updateData.rate
                }
            });
            const newAvgRate=((
                spot.commentnum*spot.avgRate-spotcomment.rate+updateData.rate)/spot.commentnum
            );
            await tx.spot.update({
                where: { id: spotcomment.spotId},
                data: {
                    avgRate: newAvgRate
                }
            });
            return tx.spotComment.findUnique({
                where: { id: spotcommentId}
            });
        })
    }
}
