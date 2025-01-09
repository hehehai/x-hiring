"use client";

import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import { activeAtom } from "@/app/_store/job-view.store";
import { JobDetailClient } from "./job-detail.client";

export function JobViewDrawer() {
	const searchParams = useSearchParams();
	const [activeId, setActiveId] = useAtom(activeAtom);

	useEffect(() => {
		if (activeId) {
			window.history.pushState(
				{},
				"",
				`/${activeId}?${searchParams.toString()}`,
			);
		} else {
			window.history.pushState({}, "", `/?${searchParams.toString()}`);
		}
	}, [activeId, searchParams]);

	return (
		<Sheet
			open={!!activeId}
			onOpenChange={(val) => {
				if (!val) {
					setActiveId(null);
				}
			}}
		>
			<SheetHeader className="hidden">
				<SheetTitle>职位详情</SheetTitle>
				<SheetDescription>职位描述</SheetDescription>
			</SheetHeader>
			<SheetContent
				side="left"
				className="min-w-full focus-visible:outline-0 md:min-w-[1000px]"
			>
				{activeId && (
					<JobDetailClient
						id={activeId}
						onClose={() => {
							setActiveId(null);
						}}
					/>
				)}
			</SheetContent>
		</Sheet>
	);
}
