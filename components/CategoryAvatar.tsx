"use client";

import Link from "next/link";
import { Category } from "@/types";

type Props = {
  category: Category;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
};

const sizeMap = {
  sm: { circle: "w-8 h-8 text-xs", name: "text-xs" },
  md: { circle: "w-10 h-10 text-sm", name: "text-xs" },
  lg: { circle: "w-16 h-16 text-base", name: "text-sm" },
};

const colorMap: Record<string, string> = {
  "korean-classic": "bg-emerald-700",
  "korean-modern": "bg-blue-700",
  "world-literature": "bg-amber-700",
  science: "bg-indigo-800",
  history: "bg-red-800",
};

export default function CategoryAvatar({
  category,
  size = "md",
  showName = false,
}: Props) {
  const { circle, name } = sizeMap[size];
  const bg = colorMap[category.id] ?? "bg-gray-600";

  return (
    <Link href={`/category/${category.id}`} className="flex flex-col items-center gap-1">
      <div
        className={`${circle} ${bg} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      >
        {category.avatar}
      </div>
      {showName && (
        <span className={`${name} text-gray-600 text-center max-w-[64px] leading-tight`}>
          {category.name}
        </span>
      )}
    </Link>
  );
}
