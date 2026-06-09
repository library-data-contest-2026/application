"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post, Category } from "@/types";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-browser";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import StoriesBar from "./StoriesBar";

type Props = {
  posts: Post[];
  categories: Category[];
  user: User | null;
};

export default function Feed({ posts, categories, user }: Props) {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <h1 className="text-xl font-bold tracking-tight">📚 LibFeed</h1>
        {user ? (
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-700">
            로그아웃
          </button>
        ) : (
          <Link href="/login" className="text-xs text-blue-500 font-semibold">
            로그인
          </Link>
        )}
      </header>

      <main className="max-w-lg mx-auto">
        <StoriesBar categories={categories} />

        <div className="divide-y divide-gray-100 sm:divide-none sm:pt-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              onOpenDetail={setSelectedPost}
            />
          ))}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-lg mx-auto flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-0.5">
            <span className="text-xl">🏠</span>
            <span className="text-[10px] text-gray-500">홈</span>
          </Link>
          <button className="flex flex-col items-center gap-0.5">
            <span className="text-xl">🔍</span>
            <span className="text-[10px] text-gray-500">탐색</span>
          </button>
          <Link href="/friends" className="flex flex-col items-center gap-0.5">
            <span className="text-xl">🤝</span>
            <span className="text-[10px] text-gray-500">친구</span>
          </Link>
          {user ? (
            <Link href={`/profile/${user.id}`} className="flex flex-col items-center gap-0.5">
              <span className="text-xl">👤</span>
              <span className="text-[10px] text-gray-500">프로필</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-0.5">
              <span className="text-xl">👤</span>
              <span className="text-[10px] text-gray-500">프로필</span>
            </Link>
          )}
        </div>
      </nav>

      <div className="h-20" />

      <PostDetailModal post={selectedPost} user={user} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
