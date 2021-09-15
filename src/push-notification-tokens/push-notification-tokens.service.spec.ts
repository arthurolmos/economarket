import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationTokensService } from './push-notification-tokens.service';

describe('PushNotificationTokensService', () => {
  let service: PushNotificationTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushNotificationTokensService],
    }).compile();

    service = module.get<PushNotificationTokensService>(
      PushNotificationTokensService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
