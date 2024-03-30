import { cache, Suspense } from "react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { jobDetail } from "@/server/functions/job/query";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinners } from "@/components/shared/icons";
import { Logo } from "@/components/shared/logo";

import { JobDetail } from "../_components/job-detail.server";

const getDetail = cache(jobDetail);

export const revalidate = 7200;

type DetailProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: DetailProps): Promise<Metadata> {
  const detail = await getDetail(params.id);

  if (!detail) {
    return {
      title: "404 | X-Hiring",
    };
  }

  return {
    title: detail.title,
  };
}

export default async function JobDetailPage({ params }: DetailProps) {
  const detail = await getDetail(params.id);
  if (!detail) {
    return notFound();
  }
  return (
    <div className="mx-auto w-full max-w-3xl py-8 max-md:px-4">
      <div className="flex items-center justify-between pb-6">
        <Link href={`/`} className="text-2xl font-bold">
          <Logo />
        </Link>
        <div className="flex items-center space-x-3">
          {detail?.originUrl ? (
            <Button asChild>
              <a href={detail.originUrl} target="_blank">
                立即申请
              </a>
            </Button>
          ) : null}
          <Button variant={"outline"} asChild>
            <Link href={`/`} scroll={false}>
              <span className="i-lucide-arrow-left-from-line"></span>
            </Link>
          </Button>
        </div>
      </div>
      <Separator />
      <Suspense
        fallback={
          <div className="flex h-full min-h-96 w-full items-center justify-center text-3xl">
            <Spinners />
          </div>
        }
      >
        <JobDetail data={detail} className="max-w-full" />
      </Suspense>
    </div>
  );
}
