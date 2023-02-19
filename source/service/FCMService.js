import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { refreshFcmToken, setUserDataInAsyncStorage } from "../utils";
import { localNotificationService } from "../service";

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === "ios") {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled == 1) {
          console.log("permission of notification", enabled);
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log("[FCMService] Permission Rejected", error);
      });
  };

  getToken = (onRegister) => {
    try {
      messaging()
        .getToken()
        .then((fcmToken) => {
          if (fcmToken) {
            onRegister(fcmToken);
          } else {
            console.log("[FCMService] User does not have a devices token");
          }
        })
        .catch((error) => {
          console.log("[FCMService] getToken Rejected", error);
        });
    } catch (error) {
      console.log("[FCMService] getToken Rejected", error);
    }
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log("[FCMService] Request Permission Rejected", error);
      });
  };

  deleteToken = () => {
    console.log("[FCMService] Delete Token");
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log("[FCMService] Delete Token Error", error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification
  ) => {
    // When Application Running on Background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "[FCMService] OnNotificationOpenedApp getInitialNotification",
        remoteMessage
      );
      if (remoteMessage) {
        const notification = remoteMessage;
        delete notification.notification;
        onOpenNotification(notification, false);
      }
    });
    //When Application open from quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          "[FCMService] getInitialNotification getInitialNotification",
          remoteMessage
        );
        if (remoteMessage) {
          const notification = remoteMessage;
          onOpenNotification(notification);
          localNotificationService.cancelAllLocalNotifications();
        }
      });
    //Forground state message
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log("[FCMService] A new FCm message arrived", remoteMessage);
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === "ios") {
          notification = remoteMessage;
        } else {
          notification = remoteMessage;
        }
        onNotification(notification, false);
      }
    });
    // Triggered when have new Token
    messaging().onTokenRefresh((fcmToken) => {
      console.log("[FCMService] New token refresh", fcmToken);
      setUserDataInAsyncStorage("token", fcmToken, true);
      refreshFcmToken(fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };

  stopAlarmRing = async () => {
    if (Platform.OS != "ios") {
      await messaging().stopAlarmRing();
    }
  };
}

export default FCMService;
