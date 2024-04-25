"use client";

import { memo } from "react";
import { Link } from 'next-view-transitions'
import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinners } from "@/components/shared/icons";

import { JobDetail } from "./job-detail";;

interface JobDetailClientProps {
  id: string;
  onClose: () => void;
}

export const JobDetailClient = memo(({ id, onClose }: JobDetailClientProps) => {
  const { data, isFetching } = api.job.detail.useQuery(
    { id },
    { refetchOnWindowFocus: false },
  );

  return (
    <>
      <div className="flex items-center justify-between p-3">
        <Button variant={"outline"} asChild>
          <Link href={`/${id}`} className="space-x-2">
            <span className="i-lucide-maximize-2"></span>
            <span>展开</span>
          </Link>
        </Button>
        <div className="flex items-center space-x-3">
          {!isFetching && data?.originUrl ? (
            <Button asChild>
              <a href={data.originUrl} target="_blank">
                立即申请
              </a>
            </Button>
          ) : null}
          <Button variant={"outline"} onClick={() => onClose()}>
            <span className="i-lucide-arrow-left-from-line"></span>
          </Button>
        </div>
      </div>
      <Separator />
      {isFetching ? (
        <div className="flex h-full min-h-96 w-full flex-grow items-center justify-center text-3xl">
          <Spinners />
        </div>
      ) : data ? (
        <div className="w-full flex-grow overflow-y-auto">
          <JobDetail data={data} className="max-md:px-4" />
        </div>
      ) : (
        <div>异常</div>
      )}
    </>
  );
});

JobDetailClient.displayName = "JobDetailClient";
