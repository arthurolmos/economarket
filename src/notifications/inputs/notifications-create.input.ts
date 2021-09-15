import { InputType } from '@nestjs/graphql';

@InputType()
export class NotificationsCreateInput {
  title: string;

  body: string;

  shoppingListId?: string;
}
