import { type SearchParamsType } from "../page";
import { JobFilter } from "./job-filter";
import { JobList } from "./job-list";
import { Suspense, useMemo } from "react";
import { Spinners } from "@/components/shared/icons";

type JobMainProps = SearchParamsType;

export const JobMain = ({
  s = "",
  dateRange,
  type = "news",
  tags,
}: JobMainProps) => {
  const tagsArray = useMemo(
    () => tags?.split(",").filter(Boolean) || [],
    [tags],
  );

  return (
    <main className="mt-14">
      <div className="px-4 md:px-8">
        <JobFilter s={s} dateRange={dateRange} type={type} tags={tagsArray} />
      </div>
      <div className="mt-12 border-t border-zinc-100">
        <Suspense
          fallback={
            <div className="flex h-full min-h-96 w-full items-center justify-center text-3xl">
              <Spinners />
            </div>
          }
        >
          <JobList s={s} dateRange={dateRange} type={type} tags={tagsArray} />
        </Suspense>
      </div>
    </main>
  );
};
