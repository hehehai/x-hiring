"use client";

import { viewLineAtom } from "@/app/_store/job-view.store";
import type { Job } from "@actijob/db";
import { useAtom } from "jotai";
import { useEffect } from "react";

export default function ViewLineWrapper({
	children,
	searchKeys = [],
	dateRange = [],
	firstSlice,
}: {
	children: React.ReactNode;
	searchKeys?: string[];
	dateRange?: (Date | undefined)[];
	firstSlice: Job[];
}) {
	const [viewLine, setViewLine] = useAtom(viewLineAtom);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!searchKeys?.length && !dateRange?.length && firstSlice?.length) {
			const firstJob = firstSlice[0];
			setViewLine({
				before: viewLine.tmp ?? viewLine.before,
				tmp: viewLine.now,
				now: firstJob?.id,
			});
		}
	}, []);

	return <>{children}</>;
}
