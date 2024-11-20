import { IsOptional, IsInt, IsString, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostsDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsString()
    searchType?: 'title' | 'content' | 'title+content';

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;

    @IsOptional()
    @IsEnum(['createdAt', 'likenum', 'commentnum'])
    sortField: 'createdAt' | 'likenum' | 'commentnum' = 'createdAt';

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortBy: 'asc' | 'desc' = 'desc';
}
