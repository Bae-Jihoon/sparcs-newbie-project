import { IsOptional, IsString, IsEnum } from 'class-validator';

export class GetSpotsDto {
    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsEnum(['address', 'name', 'description'], {
        message: 'search type must be one of "address", "name", or "description"',
    })
    searchType: 'address' | 'name' | 'description' = 'address';
}
