"use client";

import * as React from "react";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useAtom } from "jotai";
import { activeAtom } from "../_store/job-view.store";
import { useEffect } from "react";
import { JobDetailClient } from "./job-detail.client";

export function JobViewDrawer() {
  const [open, setOpen] = React.useState(false);
  const [activeId] = useAtom(activeAtom);

  useEffect(() => {
    setOpen(!!activeId);
  }, [activeId]);

  return (
    <Drawer
      direction="left"
      shouldScaleBackground={false}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerContent className="min-w-[1000px]">
        {activeId && (
          <JobDetailClient id={activeId} onClose={() => setOpen(false)} />
        )}
      </DrawerContent>
    </Drawer>
  );
}
