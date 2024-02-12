import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { JobDetail } from "../_components/job-detail.server";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const detail = await api.job.detail.query({ id: params.id });
  if (!detail) {
    return notFound();
  }
  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="flex items-center justify-between pb-6">
        <Link href={`/`} className="text-2xl font-bold">
          X-Hiring
        </Link>
        {detail?.originUrl ? (
          <Button asChild>
            <a href={detail.originUrl} target="_blank">
              立即申请
            </a>
          </Button>
        ) : null}
      </div>
      <Separator />
      <JobDetail data={detail} className="max-w-full"></JobDetail>
    </div>
  );
}
