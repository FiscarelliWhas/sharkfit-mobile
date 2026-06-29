import * as Notifications from "expo-notifications";
import { Reminder } from "../types";

const weekdayNumber = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

async function scheduleReminder(reminder: Reminder) {
  if (!reminder.enabled) return;

  await Notifications.scheduleNotificationAsync({
    content: { title: reminder.title, body: reminder.body },
    trigger:
      reminder.frequency === "daily"
        ? { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: reminder.hour, minute: reminder.minute }
        : {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: weekdayNumber[reminder.day ?? "monday"],
            hour: reminder.hour,
            minute: reminder.minute
          }
  });
}

export async function setupNotifications(reminders: Reminder[]) {
  const permissions = await Notifications.requestPermissionsAsync();
  if (!permissions.granted) return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const reminder of reminders) {
    await scheduleReminder(reminder);
  }

  return true;
}
