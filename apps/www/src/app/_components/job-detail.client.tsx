"use client";

import { memo, useEffect, useRef } from "react";
import { api } from "@/trpc/react";
import { Link } from "next-view-transitions";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinners } from "@/components/shared/icons";

import JobCorrelationList from "./job-correlation-list";
import { JobDetail } from "./job-detail";

interface JobDetailClientProps {
  id: string;
  onClose: () => void;
}

export const JobDetailClient = memo(({ id, onClose }: JobDetailClientProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = api.job.detail.useQuery(
    { id },
    { refetchOnWindowFocus: false },
  );

  const correlationQuery = api.job.correlation.useQuery(
    { id },
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [id, contentRef.current]);

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
      <div ref={contentRef} className="w-full overflow-y-auto">
        {isFetching ? (
          <div className="flex min-h-[calc(100vh-100px)] w-full flex-grow items-center justify-center text-3xl">
            <Spinners />
          </div>
        ) : data ? (
          <div className="w-full flex-grow">
            <JobDetail data={data} className="max-md:px-4" />
          </div>
        ) : (
          <div className="flex min-h-[300px] w-full items-center justify-center">
            详情获取异常
          </div>
        )}
        {correlationQuery.isFetching ? (
          <div className="flex min-h-96 w-full flex-grow items-center justify-center text-3xl">
            <Spinners />
          </div>
        ) : correlationQuery.data ? (
          <JobCorrelationList
            list={correlationQuery.data}
            isClient={true}
            className="mx-auto max-w-2xl max-md:px-4"
          />
        ) : (
          <div className="flex min-h-[300px] w-full items-center justify-center">
            类似职位获取异常
          </div>
        )}
      </div>
    </>
  );
});

JobDetailClient.displayName = "JobDetailClient";
