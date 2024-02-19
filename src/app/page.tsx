import { z } from "zod";
import { Header } from "./_components/header";
import { JobMain } from "./_components/job-main";

export const revalidate = 7200; // 2h

const SearchParamsSchema = z.object({
  s: z.string().max(256).optional().default(""),
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
  tags: z.string().max(356).optional().default(""),
});

export type SearchParamsType = z.infer<typeof SearchParamsSchema>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = SearchParamsSchema.safeParse(searchParams);
  if (!query.success) {
    return <p>Bad request</p>;
  }

  return (
    <div className="mx-auto min-h-screen min-w-0 max-w-6xl border-x border-zinc-100">
      <Header />
      <JobMain {...query.data}></JobMain>
    </div>
  );
}
