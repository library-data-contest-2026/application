"use client";

import { useState } from "react";
import Link from "next/link";
import { Category, Post } from "@/types";
import { User } from "@supabase/supabase-js";
import PostDetailModal from "@/components/PostDetailModal";

const colorMap: Record<string, string> = {
  "korean-classic": "bg-emerald-700",
  "korean-modern": "bg-blue-700",
  "world-literature": "bg-amber-700",
  science: "bg-indigo-800",
  history: "bg-red-800",
};

type Props = {
  category: Category;
  categoryPosts: Post[];
  user: User | null;
};

export default function CategoryPageClient({ category, categoryPosts, user }: Props) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const bg = colorMap[category.id] ?? "bg-gray-600";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 max-w-lg mx-auto">
        <Link href="/" className="text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="font-semibold text-base">{category.name}</h2>
      </header>

      <main className="max-w-lg mx-auto">
        <div className="bg-white px-6 py-6 flex items-center gap-6">
          <div className={`w-20 h-20 ${bg} rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
            {category.avatar}
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg mb-1">{category.name}</h1>
            <div className="flex gap-6 text-sm mb-2">
              <div className="text-center">
                <p className="font-bold">{category.post_count ?? categoryPosts.length}</p>
                <p className="text-gray-500 text-xs">게시물</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{(category.follower_count ?? 0).toLocaleString()}</p>
                <p className="text-gray-500 text-xs">팔로워</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 bg-white border-b border-gray-100">
          <p className="text-sm text-gray-600">{category.description}</p>
          <button className="mt-3 w-full py-1.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            팔로우
          </button>
        </div>

        <div className="grid grid-cols-3 gap-0.5 mt-0.5">
          {categoryPosts.map((post) => (
            <button
              key={post.id}
              className="aspect-square flex flex-col items-center justify-center cursor-pointer"
              style={{ backgroundColor: post.cover_color }}
              onClick={() => setSelectedPost(post)}
            >
              <p className="text-white font-bold text-xs text-center px-2 leading-tight">
                {post.book_title}
              </p>
              <p className="text-white/60 text-[10px] mt-1">{post.book_author}</p>
            </button>
          ))}
        </div>

        {categoryPosts.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">
            아직 게시물이 없습니다.
          </div>
        )}
      </main>

      <div className="h-4" />

      <PostDetailModal post={selectedPost} user={user} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
