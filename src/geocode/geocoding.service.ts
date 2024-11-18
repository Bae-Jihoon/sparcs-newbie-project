import {Injectable, HttpException, HttpStatus, BadRequestException, InternalServerErrorException} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodingService {
    private readonly apiKeyId = process.env.NAVER_CLIENT_ID; // 환경 변수에서 클라이언트 ID 로드
    private readonly apiKey = process.env.NAVER_API_KEY; // 환경 변수에서 API 키 로드
    private readonly baseUrl = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode';

    async getCoordinates(roadAddress: string) {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'X-NCP-APIGW-API-KEY-ID': this.apiKeyId,
                    'X-NCP-APIGW-API-KEY': this.apiKey,
                },
                params: { query: roadAddress },
            });

            if (response.data && response.data.addresses.length > 0) {
                const { x, y } = response.data.addresses[0]; // 경도(x), 위도(y)
                return { latitude: parseFloat(y), longitude: parseFloat(x) };
            } else {
                throw new BadRequestException('No coordinates found for the given address');
            }
        } catch (error) {
            console.error('Geocoding Error:', error);
            throw new InternalServerErrorException('Failed to fetch geocode data');
        }
    }
}
