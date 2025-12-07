import { z } from "zod";

export const StartIngestSchema = z.object({
  uploadId: z.string(),
  userId: z.string(),
  options: z
    .object({
      chunkSize: z.number().optional(),
      ocr: z.boolean().optional(),
    })
    .optional(),
});

export type StartIngestInput = z.infer<typeof StartIngestSchema>;
