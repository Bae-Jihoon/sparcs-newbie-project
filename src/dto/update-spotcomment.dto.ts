import {IsString, IsOptional, MaxLength, IsInt, Min, Max} from 'class-validator';

export class UpdateSpotcommentDto {
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Content must be at most 50 characters long' })
    content?: string;

    @IsOptional()
    @IsInt()
    @Min(1, { message: 'minimum : 1'})
    @Max(5, { message: 'maximum : 5'})
    rate?: number;
}
