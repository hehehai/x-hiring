import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Blocked() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-gray-900">Opp!</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          请求频率太快了
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">请稍后再试</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
