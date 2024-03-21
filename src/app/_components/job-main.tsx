import { type SearchParamsType } from "../page";
import { JobFilter } from "./job-filter";
import { JobList } from "./job-list";
import { Suspense, memo, useMemo } from "react";
import { Spinners } from "@/components/shared/icons";
import { JobViewDrawer } from "./job-view-drawer";

type JobMainProps = SearchParamsType;

export const JobMain = memo(
  ({ s = [], dateRange, type = "news" }: JobMainProps) => {
    return (
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
            <JobList s={s} dateRange={dateRange} type={type} />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <JobViewDrawer />
        </Suspense>
      </main>
    );
  },
);

JobMain.displayName = "JobMain";
