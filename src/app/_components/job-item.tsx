import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type JobItemHasTags } from "@/types/common";
import { memo } from "react";
import { JobItemWrapper } from "./job-item-wrapper";
import { JobSiteTag } from "@/components/shared/job-site-tag";

interface JobItemProps {
  data: JobItemHasTags;
}

export const JobItem = memo(({ data }: JobItemProps) => {
  return (
    <JobItemWrapper id={data.id}>
      <div className="flex w-[280px] space-x-3">
        <Avatar className="h-14 w-14 border border-zinc-100">
          {data.originUserAvatar && <AvatarImage src={data.originUserAvatar} />}
          <AvatarFallback>
            {data.originUsername?.slice(0, 1).toLocaleUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="max-w-36 space-y-3">
          <JobSiteTag type={data.originSite} />
          <div className="text-md truncate">{data.originUsername}</div>
        </div>
      </div>
      <div>
        <div className="mb-3 text-sm text-gray-500">
          {data.originCreateAt?.toLocaleString() || "未知"}
        </div>
        <div className="text-2xl">{data.title}</div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {data.tags.map((tag) => (
            <Badge
              key={tag.jobId}
              variant="outline"
              className="max-w-60 px-4 py-1 text-sm font-medium text-gray-700"
            >
              <span className="truncate">{tag.jobTag.name}</span>
            </Badge>
          ))}
        </div>
      </div>
    </JobItemWrapper>
  );
});

JobItem.displayName = "JobItem";
