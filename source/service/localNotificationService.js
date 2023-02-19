import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class LocalNotificationService {
  configure = onOpenNotification => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('[LocalNotificationService] onRegister:', token);
      },
      onNotification: function (notification) {
        console.log('[LocalNotificationService] onNotification:', notification);
        if (!notification?.data) {
          return;
        }

        onOpenNotification(notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      senderID: '859523621052',
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data, options = {}) => {
    console.log(
      'item of notifiction',
      id,
      title,
      message,
      data,
      (options = {}),
    );

    PushNotification.localNotification({
      autoCancel: true,
      data: data,
      userInfo: data,
      message: message,
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      channelId: 'apnikhetireactapp',
    });
  };

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  removeDeliveredNotificationByID = notificationId => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID:',
      notificationId,
    );
    PushNotification.cancelLocalNotification({id: `${notificationId}`});
  };

  // applicationBadge = () => {
  //     // PushNotification.setApplicationIconBadgeNumber(2);
  //     // const ShortcutBadger = NativeModules.ShortcutBadger;
  //     // let count = 1;
  //     // ShortcutBadger.applyCount(count);
  // }
}

export default LocalNotificationService;
