"use client";

import * as React from "react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAtom } from "jotai";
import { activeAtom } from "../_store/job-view.store";
import { JobDetailClient } from "./job-detail.client";

export function JobViewDrawer() {
  const [activeId, setActiveId] = useAtom(activeAtom);

  return (
    <Sheet
      open={!!activeId}
      onOpenChange={(val) => {
        if (!val) {
          setActiveId(null);
        }
      }}
    >
      <SheetContent
        side="left"
        className="focus-visible:outline-0 md:min-w-[1000px]"
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
