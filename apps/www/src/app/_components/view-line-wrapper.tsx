"use client";

import { useEffect } from "react";
import { type Job } from "@actijob/db";
import { useAtom } from "jotai";

import { viewLineAtom } from "../_store/job-view.store";

export default function ViewLineWrapper({
  children,
  s = [],
  dateRange = [],
  firstSlice,
}: {
  children: React.ReactNode;
  s?: string[];
  dateRange?: string[];
  firstSlice: Job[];
}) {
  const [viewLine, setViewLine] = useAtom(viewLineAtom);

  useEffect(() => {
    if (!s?.length && !dateRange?.length && firstSlice?.length) {
      setViewLine({
        before: viewLine.tmp ?? viewLine.before,
        tmp: viewLine.now,
        now: firstSlice[0]!.id,
      });
    }
  }, []);

  return <>{children}</>;
}
