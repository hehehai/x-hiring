import { notFound } from "next/navigation";
import { JobDetail } from "../_components/job-detail.server";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Metadata } from "next";
import { jobDetail } from "@/server/functions/job/query";
import { db } from "@/server/db";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const detail = await db.job.findUnique({
    select: {
      title: true,
    },
    where: {
      id: params.id,
    },
  });

  if (!detail) {
    return {
      title: "404 | X-Hiring",
    };
  }

  return {
    title: detail.title,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const detail = await jobDetail(params.id);
  if (!detail) {
    return notFound();
  }
  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="flex items-center justify-between pb-6">
        <Link href={`/`} className="text-2xl font-bold">
          X-Hiring
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
      <JobDetail data={detail} className="max-w-full"></JobDetail>
    </div>
  );
}
