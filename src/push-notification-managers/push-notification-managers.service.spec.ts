import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationManagersService } from './push-notification-manager.service';

describe('PushNotificationManagersService', () => {
  let service: PushNotificationManagersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushNotificationManagersService],
    }).compile();

    service = module.get<PushNotificationManagersService>(
      PushNotificationManagersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
