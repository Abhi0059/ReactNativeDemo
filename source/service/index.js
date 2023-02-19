import FCMService from "./FCMService";
import LocalNotificationService from "./localNotificationService";

const fcmService = new FCMService();
const localNotificationService = new LocalNotificationService();

export { fcmService, localNotificationService };
