import { z } from "zod";

export const searchParamsSchema = z.object({
  s: z
    .string()
    .max(999)
    .optional()
    .transform((str) => (str ? [...new Set(str.split(","))] : [])),
  dateRange: z
    .string()
    .max(256)
    .optional()
    .default("")
    .transform((str) => {
      if (str === "") {
        return undefined;
      }
      return str.split(",") ?? [];
    }),
  type: z.enum(["news", "trending"]).optional().default("news"),
});

export type SearchParamsType = z.infer<typeof searchParamsSchema>;
