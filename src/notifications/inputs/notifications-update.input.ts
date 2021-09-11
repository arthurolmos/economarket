import { InputType } from '@nestjs/graphql';

@InputType()
export class NotificationsUpdateInput {
  title?: string;
  body?: string;
  read?: boolean;
  notified?: boolean;
}
