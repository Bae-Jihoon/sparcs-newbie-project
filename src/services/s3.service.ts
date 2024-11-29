import { Injectable } from '@nestjs/common';
import {S3Client, PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
    private s3: S3Client;
    private bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.s3 = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const key = `${uuidv4()}-${file.originalname}`;

        const uploadParams = {
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await this.s3.send(new PutObjectCommand(uploadParams));

        return `https://${this.bucketName}.s3.${this.configService.get<string>(
            'AWS_REGION',
        )}.amazonaws.com/${key}`;
    }

    async deleteFile(filePath: string) {
        const bucketName = this.bucketName; // 이미 클래스 멤버로 정의된 bucketName 사용
        const region = this.configService.get<string>('AWS_REGION'); // AWS_REGION 가져오기

        // 예상되는 S3 URL 형식으로부터 Key 추출
        const prefix = `https://${bucketName}.s3.${region}.amazonaws.com/`;
        if (!filePath.startsWith(prefix)) {
            throw new Error(`Invalid file path: ${filePath}`);
        }

        // Key 값만 추출
        const key = filePath.replace(prefix, '');

        if (!key) {
            throw new Error('Failed to extract S3 key from file path.');
        }

        // S3 파일 삭제
        await this.s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
    }

}
