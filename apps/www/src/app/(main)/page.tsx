import { jobQuery } from "@/server/functions/job/query";
import { Suspense } from "react";

import { Spinners } from "@/components/shared/icons";

import { Header } from "@/components/features/header";
import { JobFilter } from "@/components/features/job-filter";
import { JobList } from "@/components/features/job-list";
import { JobViewDrawer } from "@/components/features/job-view-drawer";
import ViewLineWrapper from "@/components/features/view-line-wrapper";
import { convertToValidDateRange } from "@/lib/utils";
import type { SearchParams } from "nuqs/server";
import { homeFilterParamsCache } from "../_store/home-filter.query";

interface HomePageProps {
	searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
	const query = await homeFilterParamsCache.parse(searchParams);

	const dateRange = convertToValidDateRange([query.startDate, query.endDate]);

	const firstSlice = await jobQuery({
		searchKeys: query.search,
		dateRange,
		type: query.type,
		limit: 11,
	});

	return (
		<ViewLineWrapper
			firstSlice={firstSlice}
			searchKeys={query.search}
			dateRange={dateRange}
		>
			<div className="mx-auto min-h-screen min-w-0 max-w-6xl border-x border-zinc-100">
				<Header />
				<main className="mt-12">
					<div className="px-4 md:px-8">
						<JobFilter />
					</div>
					<div className="mt-12 border-t border-zinc-100">
						<Suspense
							fallback={
								<div className="flex h-full min-h-96 w-full items-center justify-center text-3xl">
									<Spinners />
								</div>
							}
						>
							<JobList
								searchKeys={query.search}
								dateRange={dateRange}
								type={query.type}
								firstSlice={firstSlice}
							/>
						</Suspense>
					</div>
					<Suspense fallback={null}>
						<JobViewDrawer />
					</Suspense>
				</main>
			</div>
		</ViewLineWrapper>
	);
}
