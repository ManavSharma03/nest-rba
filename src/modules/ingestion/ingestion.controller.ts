import { Controller, Post, Body } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('init')
  async handleIngestionWebhook(@Body() payload: any) {
    return this.ingestionService.triggerIngestion(payload);
  }
}
