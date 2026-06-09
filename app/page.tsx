"use client";

import { useState } from "react";
import { posts, categories } from "@/lib/mockData";
import { Post } from "@/types";
import PostCard from "@/components/PostCard";
import PostDetailModal from "@/components/PostDetailModal";
import StoriesBar from "@/components/StoriesBar";

export default function Home() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <h1 className="text-xl font-bold tracking-tight">📚 LibFeed</h1>
        <button className="text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Stories / Categories */}
        <StoriesBar categories={categories} />

        {/* Feed */}
        <div className="divide-y divide-gray-100 sm:divide-none sm:pt-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpenDetail={setSelectedPost}
            />
          ))}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-lg mx-auto flex justify-around py-3">
          {[
            { icon: "🏠", label: "홈" },
            { icon: "🔍", label: "탐색" },
            { icon: "📖", label: "서재" },
            { icon: "👤", label: "프로필" },
          ].map(({ icon, label }) => (
            <button key={label} className="flex flex-col items-center gap-0.5">
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] text-gray-500">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="h-20" />

      <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
