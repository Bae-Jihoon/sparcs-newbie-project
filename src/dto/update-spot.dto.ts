import {IsOptional, IsString, MaxLength} from 'class-validator';

export class UpdateSpotDto {
    @IsOptional()
    @IsString()
    @MaxLength(20, { message: 'The spot name must not exceed 20 characters.'})
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Description must not exceed 50 characters.'})
    description?: string;
}