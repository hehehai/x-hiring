"use client";

import { addDays, addYears } from "date-fns";
import { memo, useCallback, useMemo } from "react";

import { homeFilterParams } from "@/app/_store/home-filter.query";
import { ComboOptionInput } from "@/components/shared/combo-option-input";
import { DatePickerWithRange } from "@/components/shared/date-picker-with-range";
import { cn, convertToValidDateRange } from "@/lib/utils";
import { useQueryStates } from "nuqs";
import type { DateRange } from "react-day-picker";

const sortMap = [
	{
		key: "news",
		label: "最新",
	},
	{
		key: "trending",
		label: "热门",
	},
] as const;

export const JobFilter = memo(() => {
	const [{ search, startDate, endDate, type }, setQuery] = useQueryStates(
		homeFilterParams,
		{
			shallow: false,
		},
	);

	const dateRangeValue = useMemo(() => {
		const [from, to] = convertToValidDateRange([startDate, endDate]) || [];
		return { from, to };
	}, [startDate, endDate]);

	const handleSearch = useCallback(
		async (val: string[]) => {
			await setQuery({ search: val });
		},
		[setQuery],
	);

	const handleDateChange = useCallback(
		async (dateValue: DateRange | undefined) => {
			const range = convertToValidDateRange([dateValue?.from, dateValue?.to]);
			await setQuery({
				startDate: range[0] || null,
				endDate: range[1] || null,
			});
		},
		[setQuery],
	);

	const handleTypeChange = useCallback(
		async (type: "news" | "trending") => {
			await setQuery({ type });
		},
		[setQuery],
	);

	return (
		<div className="w-full items-center max-md:space-y-3 md:flex md:space-x-2">
			<div className="relative flex-grow">
				<ComboOptionInput initValue={search} onChange={handleSearch} />
			</div>
			<DatePickerWithRange
				placeholder="日期范围"
				defaultDate={dateRangeValue}
				onChange={handleDateChange}
				disabled={[
					{ from: addDays(new Date(), 1), to: addYears(new Date(), 100) },
				]}
			/>
			<div className="flex h-10 min-w-[240px] items-center gap-1 rounded-xl border border-input p-1">
				{sortMap.map((sortType) => (
					<button
						type="button"
						key={sortType.key}
						className={cn(
							"flex h-8 w-1/2 cursor-pointer items-center justify-center rounded-sm bg-white capitalize hover:bg-gray-100 max-md:text-sm",
							type === sortType.key ? "bg-gray-100" : "",
						)}
						onClick={() => handleTypeChange(sortType.key)}
					>
						{sortType.label}
					</button>
				))}
			</div>
		</div>
	);
});

JobFilter.displayName = "JobFilter";
