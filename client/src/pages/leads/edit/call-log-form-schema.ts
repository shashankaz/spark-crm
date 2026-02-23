import { z } from "zod";

export const callLogFormSchema = z
  .object({
    type: z.enum(["inbound", "outbound"], "Please select a call type"),
    status: z.enum(
      ["completed", "missed", "cancelled"],
      "Please select a status",
    ),
    duration: z.number().min(0, "Duration cannot be negative"),
  })
  .refine(
    (data) =>
      data.status === "missed" || data.status === "cancelled"
        ? data.duration === 0
        : true,
    {
      message: "Duration must be 0 for missed or cancelled calls",
      path: ["duration"],
    },
  );

export type CallLogFormValues = z.infer<typeof callLogFormSchema>;
