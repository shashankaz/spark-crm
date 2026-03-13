import { processTaskRemindersService } from "../modules/task/services/task.service";

const INTERVAL_MS = 60 * 1000;

export const startTaskReminderCron = (): void => {
  console.log("[TaskReminderCron] Started — polling every 60 seconds.");

  const run = async () => {
    try {
      await processTaskRemindersService();
    } catch (err) {
      console.error("[TaskReminderCron] Error processing reminders:", err);
    }
  };

  run();
  setInterval(run, INTERVAL_MS);
};
