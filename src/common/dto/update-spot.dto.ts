import {IsOptional, IsString, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateSpotDto {
    @ApiProperty({ example: 'updated name', description: 'update name of spot' })
    @IsOptional()
    @IsString()
    @MaxLength(20, { message: 'The spot name must not exceed 20 characters.'})
    name?: string;

    @ApiProperty({ example: 'updated description', description: 'update description of spot' })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Description must not exceed 50 characters.'})
    description?: string;
}