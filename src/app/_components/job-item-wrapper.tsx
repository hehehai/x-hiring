"use client";

import { useAtom } from "jotai";
import { activeAtom } from "../_store/job-view.store";

export const JobItemWrapper = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [active, setActive] = useAtom(activeAtom);

  return (
    <div
      className="flex cursor-pointer border-b border-zinc-100 bg-white px-8 py-8 hover:bg-zinc-50"
      onClick={() => {
        if (active !== id) {
          setActive(id);
        }
      }}
    >
      {children}
    </div>
  );
};
