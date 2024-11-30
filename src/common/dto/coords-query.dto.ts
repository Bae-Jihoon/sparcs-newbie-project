import { IsNotEmpty, IsString, Matches } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CoordsQueryDto {
    @ApiProperty({ example: '127.3595174,36.3734336', description: 'coords: longitude,latitude' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/, {
        message: 'Coords must be in the format "longitude,latitude"',
    })
    coords: string;
}
