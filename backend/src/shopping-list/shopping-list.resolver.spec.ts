import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListResolver } from './shopping-list.resolver';

describe('ShoppingListResolver', () => {
  let resolver: ShoppingListResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingListResolver],
    }).compile();

    resolver = module.get<ShoppingListResolver>(ShoppingListResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
