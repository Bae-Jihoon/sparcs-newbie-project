import {IsOptional, IsInt, IsString, IsEnum, Min, Max, IsIn} from 'class-validator';
import { Transform } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class GetPostsDto {
    @ApiProperty({ example: 'today', description: 'keyword for searching' })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiProperty({ example: 'title', description: 'where you want to search (title/content/title+content)' })
    @IsOptional()
    @IsIn(['title', 'content', 'title+content'])
    @IsString()
    searchType?: string;

    @ApiProperty({ example: '1', description: 'page number' })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ example: '10', description: 'posts per page' })
    @IsOptional()
    @Transform(({ value }) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 20 : parsed; // 기본값 20 적용
    })
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiProperty({ example: 'likenum', description: 'sort criteria(createdAt/likenum/commentnum)' })
    @IsOptional()
    @IsIn(['createdAt', 'likenum', 'commentnum'])
    sortField?: string = 'createdAt';

    @ApiProperty({ example: 'asc', description: 'sort method' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortBy?: string = 'desc';
}
