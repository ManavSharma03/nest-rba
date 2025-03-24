import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IngestionService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async triggerIngestion(payload: any) {
    try {
      // Replace with your Python backend URL
      const pythonApiUrl = 'http://python-backend-url/ingestion-start';

      // Make an API call to the Python backend
      const response = await this.httpService
        .post(pythonApiUrl, payload)

      return {
        message: 'Ingestion triggered successfully',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }
}
