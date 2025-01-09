"use client";

import { useAtom } from "jotai";

import { viewLineAtom } from "@/app/_store/job-view.store";

export default function ViewLine({ id }: { id: string }) {
  const [viewLine] = useAtom(viewLineAtom);

  if (viewLine.before === viewLine.now || viewLine.before !== id) {
    return null;
  }

  return (
    <div className="absolute inset-x-0 top-0 h-[1px] w-full bg-red-300">
      <span className="absolute left-1/2 md:left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-md bg-red-500 px-2 py-0.5 text-[13px] text-sm text-white shadow-sm">
        上次查看
      </span>
    </div>
  );
}
