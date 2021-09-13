import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

// export const subscription = {
//   provide: 'PUB_SUB',
//   useValue: new PubSub(),
// };

interface RedisOptions {
  options: {
    host: string;
    port: number;
    retryStrategy: (times: number) => number;
  };
}

export const redisOptions = (): RedisOptions => {
  return {
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      retryStrategy: (times) => {
        // reconnect after
        return Math.min(times * 50, 2000);
      },
    },
  };
};

export const redisSubscription = {
  provide: 'REDIS_PUB_SUB',
  useFactory: (configService: ConfigService) => {
    const redisOptions = configService.get<RedisOptions>('options');

    console.log({ redisOptions });

    return new RedisPubSub({
      publisher: new Redis(redisOptions.options),
      subscriber: new Redis(redisOptions.options),
    });
  },
  inject: [ConfigService],
};
