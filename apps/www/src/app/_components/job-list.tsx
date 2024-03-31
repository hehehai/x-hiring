import { useId } from "react";
import { type Job } from "@actijob/db";

import { JobItem } from "./job-item";
import { JobMore } from "./job-more";

interface JobListProps {
  s?: string[];
  dateRange?: string[];
  type?: "news" | "trending";
  firstSlice: Job[];
}

export const JobList = async ({
  s = [],
  dateRange,
  type = "news",
  firstSlice = [],
}: JobListProps) => {
  const id = useId();
  const nextCursor = firstSlice.length > 10 ? firstSlice.pop() : undefined;

  return (
    <div className="w-full">
      {firstSlice.length ? (
        firstSlice.map((job) => <JobItem key={id + job.id} data={job} s={s} />)
      ) : (
        <div className="flex h-full min-h-96 w-full items-center justify-center">
          <div>数据为空</div>
        </div>
      )}

      {nextCursor && (
        <JobMore
          s={s}
          dateRange={dateRange}
          type={type}
          cursor={nextCursor.id}
        />
      )}
    </div>
  );
};
