import { PubSub } from 'graphql-subscriptions';

export const subscription = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
};
