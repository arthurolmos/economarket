import { Test, TestingModule } from '@nestjs/testing';
import { WebScraping } from './web-scraping';

describe('WebScraping', () => {
  let provider: WebScraping;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebScraping],
    }).compile();

    provider = module.get<WebScraping>(WebScraping);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
