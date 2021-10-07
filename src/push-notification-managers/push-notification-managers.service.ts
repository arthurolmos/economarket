import { Inject, Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { Notification } from '../notifications/notification.entity';
import { PushNotificationTokensService } from '../push-notification-tokens/push-notification-tokens.service';

@Injectable()
export class PushNotificationManagersService {
  constructor(
    @Inject('EXPO_NOTIFICATION') private expo: Expo,
    private pushNotificationTokensService: PushNotificationTokensService,
  ) {}

  async sendNotification(notification: Notification) {
    const notificationTokens =
      await this.pushNotificationTokensService.findAllByUser(
        notification.user.id,
      );

    const expoTokens = [];
    notificationTokens.forEach((notificationToken) => {
      if (notificationToken.token) expoTokens.push(notificationToken.token);
    });

    if (notificationTokens.length > 0) {
      const message: ExpoPushMessage = {
        to: expoTokens,
        title: notification.title,
        body: notification.body,
        data: { shoppingListId: notification.shoppingListId },
      };

      this.sendExpoNotifications([message]);
    }
  }

  private async sendExpoNotifications(messages: ExpoPushMessage[]) {
    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    const chunks = this.expo.chunkPushNotifications(messages);

    const tickets = [];
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }

    const receiptIds = [];
    for (const ticket of tickets) {
      // NOTE: Not all tickets have IDs; for example, tickets for notifications
      // that could not be enqueued will have error information and no receipt ID.
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(receiptIds);

    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await this.expo.getPushNotificationReceiptsAsync(
          chunk,
        );
        console.log({ receipts });

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (const receiptId in receipts) {
          const { status, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(
              `There was an error sending a notification! ${details}`,
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
