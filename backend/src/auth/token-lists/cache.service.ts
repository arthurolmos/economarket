import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async add(key: string, value: string) {
    await this.cacheManager.set(key, value);
  }

  async remove(key: string) {
    await this.cacheManager.del(key);
  }

  async find(key: string) {
    const value = await this.cacheManager.get(key);

    return value;
  }

  async exists(key: string) {
    const exists = await this.cacheManager.get(key);

    return exists ? true : false;
  }
}
