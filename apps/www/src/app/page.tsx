import { Suspense } from "react";
import { jobQuery } from "@/server/functions/job/query";

import { searchParamsSchema } from "@/lib/validations/jobs";
import { Spinners } from "@/components/shared/icons";

import { Header } from "./_components/header";
import { JobFilter } from "./_components/job-filter";
import { JobList } from "./_components/job-list";
import { JobViewDrawer } from "./_components/job-view-drawer";

export const revalidate = 7200;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = searchParamsSchema.safeParse(searchParams);
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
