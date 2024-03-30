"use client";

import * as React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { type DateRange, type Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { DateLineIcon } from "./icons";

interface DatePickerWithRangeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  disabled?: Matcher | Matcher[] | undefined;
  placeholder?: string;
  defaultDate?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange(props: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    props.defaultDate,
  );

  const handleChange = (date: DateRange | undefined) => {
    setDate(date);
    props.onChange?.(date);
  };

  return (
    <div className={cn("grid gap-2", props.className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "text-md min-w-[270px] justify-start text-left font-normal",
              !date && "text-secondary-foreground",
            )}
          >
            <DateLineIcon className="mr-2 text-xl" />
            <div className="space-x-2">
              {date?.from ? (
                date.to ? (
                  <>
                    <span>{format(date.from, "yyyy/MM/dd")}</span>
                    <span> - </span>
                    <span>{format(date.to, "yyyy/MM/dd")}</span>
                  </>
                ) : (
                  <span>{format(date.from, "yyyy/MM/dd")}</span>
                )
              ) : (
                <span className="text-secondary-foreground">
                  {props.placeholder ?? "Pick a date"}
                </span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={zhCN}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleChange}
            numberOfMonths={2}
            disabled={props.disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
