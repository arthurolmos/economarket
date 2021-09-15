import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationTokensResolver } from './push-notification-tokens.resolver';

describe('PushNotificationTokensResolver', () => {
  let resolver: PushNotificationTokensResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushNotificationTokensResolver],
    }).compile();

    resolver = module.get<PushNotificationTokensResolver>(
      PushNotificationTokensResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
