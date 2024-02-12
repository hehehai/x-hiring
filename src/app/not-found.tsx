import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function notFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-gray-900">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          未找到页面
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          抱歉!我们找不到您要查找的页面
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default notFound;
