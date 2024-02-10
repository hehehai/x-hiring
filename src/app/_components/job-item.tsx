import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type Job, type JobTag } from "@prisma/client";
import { memo } from "react";

const siteTagMap = {
  V2EX: {
    label: "V2EX",
    class: "bg-gradient-to-b from-black to-gray-800",
  },
  ELE_DUCK: {
    label: "电鸭",
    class: "bg-gradient-to-b from-orange-500 to-orange-400",
  },
};

const JobSiteTag = ({ type }: { type: "V2EX" | "ELE_DUCK" }) => {
  const { label, class: cls } = siteTagMap[type];
  return <Badge className={cls}>{label}</Badge>;
};

interface JobTagsRelations {
  jobTagId: string;
  jobId: string;
  assignedAt: Date;
  jobTag: JobTag;
}

interface JobItemProps {
  data: Job & { tags: JobTagsRelations[] };
}

export const JobItem = memo(({ data }: JobItemProps) => {
  return (
    <div className="flex cursor-pointer border-b border-zinc-100 bg-white px-8 py-8 hover:bg-zinc-50">
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
              className="max-w-60 px-4 py-1 text-sm text-gray-700"
            >
              <span className="truncate">{tag.jobTag.name}</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
});

JobItem.displayName = "JobItem";
