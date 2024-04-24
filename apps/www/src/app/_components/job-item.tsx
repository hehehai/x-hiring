import { memo } from "react";
import Highlighter from "react-highlight-words";

import { formatPosDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { JobSiteTag } from "@/components/shared/job-site-tag";

import { JobItemWrapper } from "./job-item-wrapper";
import { type RouterOutput } from "@/server/api/root";

interface JobItemProps {
  s?: string[];
  data: RouterOutput["job"]["queryWithCursor"]['data'][number];
}

export const JobItem = memo(({ s, data }: JobItemProps) => {
  const publishDate = data.originCreateAt
    ? `${formatPosDate(data.originCreateAt)} 发布`
    : "未知";

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
            <div className="text-sm text-gray-500 md:hidden">{publishDate}</div>
          </div>
          <div className="text-md truncate">{data.originUsername}</div>
        </div>
      </div>
      <div>
        <div className="mb-3 text-sm text-gray-500 max-md:hidden">
          {publishDate}
        </div>
        <div className="text-xl md:text-2xl">
          {s?.length ? (
            <Highlighter
              searchWords={s}
              autoEscape={true}
              textToHighlight={data.title ?? ""}
            />
          ) : (
            data.title
          )}
        </div>
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
