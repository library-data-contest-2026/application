"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Post } from "@/types";
import BottomNav from "@/components/BottomNav";
import PostDetailModal from "@/components/PostDetailModal";
import { User } from "@supabase/supabase-js";

type Props = {
  userId: string | null;
};

export default function SearchClient({ userId }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (!userId) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, [userId]);

  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setResults([]);
      setSearched(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase.rpc("search_posts", { q });
      setResults((data as Post[]) ?? []);
      setSearched(true);
      setLoading(false);
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 검색바 헤더 */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 max-w-lg mx-auto">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 저자, 태그, 카테고리 검색"
            className="w-full pl-9 pr-9 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-3 pb-24">
        {/* 초기 상태 */}
        {!query && (
          <div className="py-20 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">책 제목, 저자, 태그로 검색해보세요.</p>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="py-12 text-center text-sm text-gray-400">검색 중...</div>
        )}

        {/* 결과 없음 */}
        {!loading && searched && results.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-sm">
              <span className="font-semibold text-gray-600">&ldquo;{query}&rdquo;</span> 에 대한 결과가 없어요.
            </p>
          </div>
        )}

        {/* 결과 목록 */}
        {!loading && results.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-3">
              <span className="font-semibold text-gray-600">&ldquo;{query}&rdquo;</span> 검색 결과 {results.length}건
            </p>
            <div className="flex flex-col gap-2">
              {results.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="w-full bg-white rounded-xl border border-gray-200 flex items-center gap-4 px-4 py-3 text-left hover:shadow-sm active:scale-[0.99] transition-all"
                >
                  {/* 미니 커버 */}
                  <div
                    className="w-12 h-16 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: post.cover_color }}
                  >
                    <span className="text-white text-[10px] font-bold text-center px-1 leading-tight">
                      {post.book_title.slice(0, 6)}
                    </span>
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{post.book_title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{post.book_author}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{post.categories?.name}</p>
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] text-blue-400">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 좋아요 수 */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">♥ {post.like_count}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav userId={userId} />

      <PostDetailModal
        post={selectedPost}
        user={currentUser}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
