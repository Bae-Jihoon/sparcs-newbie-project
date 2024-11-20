import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class CreateSpotDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20, { message: 'The spot name must not exceed 20 characters.'})
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50, { message: 'Description must not exceed 50 characters.'})
    description: string;
}