import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

// export const subscription = {
//   provide: 'PUB_SUB',
//   useValue: new PubSub(),
// };

interface RedisOptions {
  host: string;
  port: number;
  password: string;
  url: string;
  retryStrategy: (times: number) => number;
}

export const redisOptions = () => {
  return {
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      url: process.env.REDIS_URL,
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
    const options = configService.get<RedisOptions>('options');

    console.log(options);
    return new RedisPubSub({
      publisher: new Redis(options.url, {
        retryStrategy: options.retryStrategy,
      }),
      subscriber: new Redis(options.url, {
        retryStrategy: options.retryStrategy,
      }),
    });
  },
  inject: [ConfigService],
};
