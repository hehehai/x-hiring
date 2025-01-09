import type { correlation } from "@/server/functions/job/query";
import { Link } from "next-view-transitions";
import type React from "react";

import { JobSiteTag } from "@/components/shared/job-site-tag";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatPosDate } from "@/lib/utils";

import { JobItemWrapper } from "./job-item-wrapper";

interface JobCorrelationList extends React.ComponentPropsWithoutRef<"div"> {
	list: Awaited<ReturnType<typeof correlation>>;
	isClient?: boolean;
}

function JobCorrelationList({
	list,
	isClient = false,
	...props
}: JobCorrelationList) {
	return (
		<div {...props} className={cn("w-full py-8", props.className)}>
			<Separator />
			<h3 className="mb-7 mt-5 text-xl">相似职位</h3>
			<div className="space-y-4">
				{list.map((job) => (
					<JobCorrelationItem key={job.id} job={job} isClient={isClient} />
				))}
			</div>
		</div>
	);
}

export default JobCorrelationList;

interface JobCorrelationItem extends React.ComponentPropsWithoutRef<"div"> {
	job: Awaited<ReturnType<typeof correlation>>[number];
	isClient?: boolean;
}

function JobCorrelationItem({ job, isClient = false }: JobCorrelationItem) {
	const renderCard = (
		<Card className="cursor-pointer">
			<CardHeader className="p-4">
				<div className="md:flex md:items-center md:space-x-3">
					<div className="flex items-center space-x-3">
						<JobSiteTag type={job.originSite} />
						<div className="flex items-center space-x-2">
							{job.originUserAvatar && (
								<img
									src={job.originUserAvatar}
									className="h-5 w-5 rounded-full border border-zinc-100"
									alt={job.originUsername || ""}
								/>
							)}
							<div className="max-w-[240px]">
								<div className="truncate text-sm">{job.originUsername}</div>
							</div>
						</div>
					</div>
					<div className="mt-3 text-sm text-gray-500 md:mt-0">
						{job.originCreateAt
							? `${formatPosDate(job.originCreateAt)} 发布`
							: "未知"}
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<div className="text-md">{job.title}</div>
				<div className="mt-3 flex flex-wrap items-center gap-2">
					{job.tags.map((tag) => (
						<Badge
							key={tag}
							variant="outline"
							className="max-w-60 px-3 py-1 text-xs font-medium text-gray-700"
						>
							<span className="truncate">{tag}</span>
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);

	if (isClient) {
		return <JobItemWrapper id={job.id}>{renderCard}</JobItemWrapper>;
	}

	return (
		<Link key={job.id} href={`/${job.id}`} className="block">
			{renderCard}
		</Link>
	);
}
