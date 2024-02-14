"use client";

import { DatePickerWithRange } from "@/components/shared/date-picker-with-range";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const sortMap = [
  {
    key: "news",
    label: "最新",
  },
  {
    key: "trending",
    label: "热门",
  },
];

interface JobFilterProps {
  s?: string;
  dateRange?: string[];
  type?: string;
  tags?: string[];
}

export const JobFilter = ({
  s = "",
  dateRange,
  type,
  tags,
}: JobFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dateRangeValue = useMemo(() => {
    const [startDate, endDate] = dateRange || [];
    return {
      from: startDate ? new Date(startDate) : undefined,
      to: endDate ? new Date(endDate) : undefined,
    };
  }, [dateRange]);

  const updateQueryParams = useCallback(
    (data: JobFilterProps) => {
      const params = new URLSearchParams(searchParams.toString());

      if (data.s != null) {
        params.set("s", data.s);
      }
      if (data.dateRange != null) {
        params.set(
          "dateRange",
          data.dateRange.length ? data.dateRange.join(",") : "",
        );
      }
      if (data.type != null) {
        params.set("type", data.type);
      }
      if (data.tags != null) {
        params.set("tags", data.tags.join(","));
      }
      console.log("updateQueryParams", params.toString());
      router.replace(`/?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="w-full items-center max-md:space-y-3 md:flex md:space-x-2">
      <div className="relative flex-grow">
        <Input
          defaultValue={s}
          placeholder="搜索招聘信息"
          className="pl-9"
          onChange={(e) => {
            if (e.target.value !== s) {
              updateQueryParams({ s: e.target.value });
            }
          }}
        />
        <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center">
          <span className="i-lucide-search"></span>
        </div>
      </div>
      <DatePickerWithRange
        placeholder="日期范围"
        defaultDate={dateRangeValue}
        onChange={(dateValue) => {
          const range: string[] = [];
          if (dateValue?.from) {
            range.push(dateValue.from.toISOString());
          }
          if (dateValue?.to) {
            range.push(dateValue.to.toISOString());
          }
          updateQueryParams({ dateRange: range });
        }}
        disabled={[{ from: new Date(), to: new Date("2224-01-01") }]}
      />
      <div className="flex h-10 min-w-[240px] items-center gap-1 rounded-xl border border-input p-1">
        {sortMap.map((sortType) => (
          <div
            key={sortType.key}
            className={cn(
              "flex h-8 w-1/2 cursor-pointer items-center justify-center rounded-sm bg-white capitalize hover:bg-gray-100 max-md:text-sm",
              type === sortType.key ? "bg-gray-100" : "",
            )}
            onClick={() => updateQueryParams({ type: sortType.key })}
          >
            {sortType.label}
          </div>
        ))}
      </div>
    </div>
  );
};
