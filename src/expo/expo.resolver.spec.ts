import { Test, TestingModule } from '@nestjs/testing';
import { ExpoResolver } from './expo.resolver';

describe('ExpoResolver', () => {
  let resolver: ExpoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpoResolver],
    }).compile();

    resolver = module.get<ExpoResolver>(ExpoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
