"use client";

import { useRouter } from "next/navigation";
import { useAtom } from "jotai";

import { activeAtom } from "../_store/job-view.store";

export const JobItemWrapper = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [active, setActive] = useAtom(activeAtom);

  return (
    <div
      className="flex cursor-pointer border-b border-zinc-100 bg-white p-5 hover:bg-zinc-50 max-md:flex-col max-md:space-y-4 md:p-8"
      onClick={() => {
        if (active !== id) {
          if (window.document.documentElement.offsetWidth < 768) {
            router.push(`/${id}`);
          } else {
            setActive(id);
          }
        }
      }}
    >
      {children}
    </div>
  );
};
