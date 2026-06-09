"use client";

import { Category } from "@/types";
import CategoryAvatar from "./CategoryAvatar";

type Props = {
  categories: Category[];
};

export default function StoriesBar({ categories }: Props) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex gap-4 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center gap-1 shrink-0">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <div className="p-0.5 bg-white rounded-full">
                <CategoryAvatar category={cat} size="lg" />
              </div>
            </div>
            <span className="text-xs text-gray-600 text-center max-w-[64px] leading-tight">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
