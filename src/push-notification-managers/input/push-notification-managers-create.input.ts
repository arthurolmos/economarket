import { InputType } from '@nestjs/graphql';

@InputType()
export class PushNotificationManagersCreateInput {
  pushNotificationToken: string;

  userId: string;
}
