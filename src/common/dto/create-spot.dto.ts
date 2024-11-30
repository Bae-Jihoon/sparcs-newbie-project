import {IsNotEmpty, IsString, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateSpotDto {
    @ApiProperty({ example: 'perfect spot', description: 'name of spot' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20, { message: 'The spot name must not exceed 20 characters.'})
    name: string;

    @ApiProperty({ example: 'fantastic view', description: 'description of spot' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50, { message: 'Description must not exceed 50 characters.'})
    description: string;
}