import { jobQuery } from "@/server/functions/job/query";
import { JobItem } from "./job-item";
import { JobMore } from "./job-more";
import { useId } from "react";

interface JobListProps {
  s?: string;
  dateRange?: string[];
  type?: "news" | "trending";
  tags?: string[];
}

export const JobList = async ({
  s = "",
  dateRange,
  type = "news",
  tags,
}: JobListProps) => {
  const id = useId();
  const firstSlice = await jobQuery({
    s,
    dateRange,
    type,
    tags,
    limit: 11,
  });
  const nextCursor = firstSlice.length > 10 ? firstSlice.pop() : undefined;

  return (
    <div className="w-full">
      {firstSlice.length ? (
        firstSlice.map((job) => <JobItem key={id + job.id} data={job} />)
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
          tags={tags}
          cursor={nextCursor.id}
        />
      )}
    </div>
  );
};
