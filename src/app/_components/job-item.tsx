import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { memo } from "react";
import { JobItemWrapper } from "./job-item-wrapper";
import { JobSiteTag } from "@/components/shared/job-site-tag";
import { type Job } from "@prisma/client";
import { format } from "date-fns";

interface JobItemProps {
  data: Job;
}

export const JobItem = memo(({ data }: JobItemProps) => {
  return (
    <JobItemWrapper id={data.id}>
      <div className="flex flex-shrink-0 space-x-3 md:w-[280px]">
        <Avatar className="h-12 w-12 border border-zinc-100 md:h-14 md:w-14">
          {data.originUserAvatar && <AvatarImage src={data.originUserAvatar} />}
          <AvatarFallback>
            {data.originUsername?.slice(0, 1).toLocaleUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 max-md:flex-grow md:max-w-36 md:space-y-3">
          <div className="flex items-center justify-between">
            <JobSiteTag type={data.originSite} />
            <div className="text-sm text-gray-500 md:hidden">
              {data.originCreateAt
                ? format(data.originCreateAt, "yyyy/MM/dd HH:mm")
                : "未知"}
            </div>
          </div>
          <div className="text-md truncate">{data.originUsername}</div>
        </div>
      </div>
      <div>
        <div className="mb-3 text-sm text-gray-500 max-md:hidden">
          {data.originCreateAt?.toLocaleString() || "未知"}
        </div>
        <div className="text-xl md:text-2xl">{data.title}</div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {data.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="max-w-60 px-4 py-1 font-medium text-gray-700 md:text-sm"
            >
              <span className="truncate">{tag}</span>
            </Badge>
          ))}
        </div>
      </div>
    </JobItemWrapper>
  );
});

JobItem.displayName = "JobItem";
