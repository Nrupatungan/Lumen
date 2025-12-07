import { z } from "zod";

export const QuerySchema = z.object({
  userId: z.string(),
  prompt: z.string(),
  chatSessionId: z.string().optional(),
  stream: z.boolean().optional(),
});

export type QueryInput = z.infer<typeof QuerySchema>;
