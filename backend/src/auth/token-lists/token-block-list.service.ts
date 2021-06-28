import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';

@Injectable()
export class TokenBlockListService {
  readonly prefix = 'block-list-token:';

  constructor(private cacheService: CacheService) {}

  async add(token: string, id: string) {
    const key = this.prefix + token;
    await this.cacheService.add(key, id);
  }

  async remove(token: string) {
    const key = this.prefix + token;
    await this.cacheService.remove(key);
  }

  async find(token: string) {
    const key = this.prefix + token;
    const value = await this.cacheService.find(key);

    return value;
  }

  async exists(token: string) {
    const key = this.prefix + token;
    const exists = await this.cacheService.find(key);

    return exists ? true : false;
  }
}
