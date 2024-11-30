import {IsOptional, IsString, IsIn} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class GetSpotsDto {
    @ApiProperty({ example: '대전', description: 'keyword for searching' })
    @IsOptional()
    @IsString()
    region?: string;

    @ApiProperty({ example: 'address', description: 'where you want to search (address/name/description)' })
    @IsOptional()
    @IsString()
    @IsIn(['address', 'name', 'description'], {
        message: 'search type must be one of "address", "name", or "description"',
    })
    searchType?: string = 'address';
}
