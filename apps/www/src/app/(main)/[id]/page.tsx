import { jobDetail } from "@/server/functions/job/query";
import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { Suspense, cache } from "react";

import { Spinners } from "@/components/shared/icons";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import JobCorrelationServerList from "@/components/features/job-correlation";
import { JobDetail } from "@/components/features/job-detail";

const getDetail = cache(jobDetail);

export const dynamic = "force-static";

type DetailProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({
	params,
}: DetailProps): Promise<Metadata> {
	const { id } = await params;
	const detail = await getDetail(id);

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
	const { id } = await params;
	const detail = await getDetail(id);
	if (!detail) {
		return notFound();
	}

	return (
		<div className="mx-auto w-full max-w-3xl py-8 max-md:px-4">
			<div className="flex items-center justify-between pb-6">
				<Link href={"/"} className="text-2xl font-bold">
					<Logo />
				</Link>
				<div className="flex items-center space-x-3">
					{detail?.originUrl ? (
						<Button asChild>
							<a href={detail.originUrl} target="_blank" rel="noreferrer">
								立即申请
							</a>
						</Button>
					) : null}
					<Button variant={"outline"} asChild>
						<Link href={"/"} scroll={false}>
							<span className="i-lucide-arrow-left-from-line" />
						</Link>
					</Button>
				</div>
			</div>
			<Separator />
			<Suspense
				fallback={
					<div className="flex min-h-[calc(100vh-100px)] w-full items-center justify-center">
						<Spinners />
					</div>
				}
			>
				<JobDetail data={detail} className="max-w-full" />
			</Suspense>
			<Suspense
				fallback={
					<div className="flex min-h-96 w-full items-center justify-center">
						<Spinners />
					</div>
				}
			>
				<JobCorrelationServerList id={detail.id} fullTags={detail.fullTags} />
			</Suspense>
		</div>
	);
}
