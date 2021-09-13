import { Transport, ClientProviderOptions } from '@nestjs/microservices';

export const config: ClientProviderOptions = {
  name: 'NOTIFICATION_SERVICE',
  transport: Transport.REDIS,
  options: {
    url: 'redis://localhost:6379',
  },
};
