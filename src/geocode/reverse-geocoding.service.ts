import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ReverseGeocodingService {
    private readonly apiKeyId = process.env.NAVER_CLIENT_ID; // 환경변수에서 Client ID
    private readonly apiKey = process.env.NAVER_API_KEY; // 환경변수에서 API Key
    private readonly baseUrl = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc';

    async getAddress(latitude: number, longitude: number): Promise<string> {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'X-NCP-APIGW-API-KEY-ID': this.apiKeyId,
                    'X-NCP-APIGW-API-KEY': this.apiKey,
                },
                params: {
                    coords: `${longitude},${latitude}`,
                    orders: 'roadaddr', // 도로명 주소 우선 반환
                    output: 'json',
                },
            });

            // 응답에서 도로명 주소 가져오기
            const results = response.data.results;
            if (results.length > 0) {
                const region = results[0].region;
                const land = results[0].land;

                // 도로명 주소 조합
                const area1 = region?.area1?.name || ''; // 시/도
                const area2 = region?.area2?.name || ''; // 시/군/구
                const roadName = land?.name || ''; // 도로명
                const buildingNumber = land?.number1 || ''; // 건물 번호

                return `${area1} ${area2} ${roadName} ${buildingNumber}`;
            }

            throw new NotFoundException('No address found for the given coordinates');

        } catch (error) {
            console.error('Reverse Geocoding Error:', error);
            throw new InternalServerErrorException('Failed to fetch reverse geocode data');
        }
    }
}
