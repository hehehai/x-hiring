import { notFound } from "next/navigation";
import { JobDetail } from "../_components/job-detail.server";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Metadata } from "next";
import { api } from "@/trpc/server";
import { Logo } from "@/components/shared/logo";

type DetailProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: DetailProps): Promise<Metadata> {
  const detail = await api.job.detail.query(params, {});

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
  const detail = await api.job.detail.query(params);
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
      <JobDetail data={detail} className="max-w-full"></JobDetail>
    </div>
  );
}
