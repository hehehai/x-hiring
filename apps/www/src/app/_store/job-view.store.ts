import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export const activeAtom = atom<string | null>(null);

interface ViewLine {
  before?: string;
  tmp?: string;
  now?: string;
}

export const viewLineAtom = atomWithStorage<ViewLine>(
  "storage:view-line",
  {},
  undefined,
  {
    getOnInit: true,
  },
);
