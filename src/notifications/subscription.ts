import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ClientProxy } from '@nestjs/microservices';
import { config } from '../config/redis';
import * as Redis from 'ioredis';

// export const subscription = {
//   provide: 'PUB_SUB',
//   useValue: new PubSub(),
// };

const options = {
  host: 'localhost',
  port: 6379,
  retryStrategy: (times) => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
};

export const redisSubscription = {
  provide: 'REDIS_PUB_SUB',
  useValue: new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  }),
};
