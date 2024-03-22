import { z } from "zod";
import { Header } from "./_components/header";
import { JobFilter } from "./_components/job-filter";
import { Suspense } from "react";
import { Spinners } from "@/components/shared/icons";
import { JobList } from "./_components/job-list";
import { JobViewDrawer } from "./_components/job-view-drawer";
import { jobQuery } from "@/server/functions/job/query";

const SearchParamsSchema = z.object({
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

  const { s, dateRange, type } = query.data;

  const firstSlice = await jobQuery({
    s,
    dateRange,
    type,
    limit: 11,
  });

  return (
    <div className="mx-auto min-h-screen min-w-0 max-w-6xl border-x border-zinc-100">
      <Header />
      <main className="mt-12">
        <div className="px-4 md:px-8">
          <JobFilter s={s} dateRange={dateRange} type={type} />
        </div>
        <div className="mt-12 border-t border-zinc-100">
          <Suspense
            fallback={
              <div className="flex h-full min-h-96 w-full items-center justify-center text-3xl">
                <Spinners />
              </div>
            }
          >
            <JobList
              s={s}
              dateRange={dateRange}
              type={type}
              firstSlice={firstSlice}
            />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <JobViewDrawer />
        </Suspense>
      </main>
    </div>
  );
}
