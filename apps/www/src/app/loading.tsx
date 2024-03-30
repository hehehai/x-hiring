import { Spinners } from "@/components/shared/icons";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-3xl">
      <Spinners />
    </div>
  );
}
