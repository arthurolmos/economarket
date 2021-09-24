import { Module } from '@nestjs/common';
import { WebScraping } from './web-scraping';
import { WebScrapingService } from './web-scraping.service';

@Module({
  providers: [WebScrapingService, WebScraping],
})
export class WebScrapingModule {}
