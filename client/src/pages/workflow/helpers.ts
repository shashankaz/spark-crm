export const entityEvents: Record<string, { id: string; label: string }[]> = {
  lead: [
    { id: "create", label: "Create" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
    { id: "status_change", label: "Status Change" },
  ],
  deal: [
    { id: "create", label: "Create" },
    { id: "won", label: "Won" },
    { id: "lost", label: "Lost" },
    { id: "update", label: "Update" },
  ],
  organization: [
    { id: "create", label: "Create" },
    { id: "update", label: "Update" },
    { id: "status_change", label: "Status Change" },
  ],
};

export const availableActions: {
  id: string;
  label: string;
  description: string;
}[] = [
  {
    id: "send_email",
    label: "Send Email",
    description: "Send an automated email notification",
  },
  {
    id: "add_task",
    label: "Add Task",
    description: "Automatically create a task when this event fires",
  },
  {
    id: "add_task_with_reminder",
    label: "Add Task with Reminder",
    description:
      "Create a task and schedule a reminder email at a specified time",
  },
];
