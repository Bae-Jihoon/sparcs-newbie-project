import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CoordsQueryDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/, {
        message: 'Coords must be in the format "longitude,latitude"',
    })
    coords: string;
}
