import { z } from "zod";

export const CreateUploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
  userId: z.string(),
});

export type CreateUploadInput = z.infer<typeof CreateUploadSchema>;
