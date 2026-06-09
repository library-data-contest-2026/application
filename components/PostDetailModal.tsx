"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-browser";
import CategoryAvatar from "./CategoryAvatar";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { username: string } | null;
};

type Props = {
  post: Post | null;
  user: User | null;
  onClose: () => void;
};

export default function PostDetailModal({ post, user: userProp, onClose }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(userProp);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  useEffect(() => {
    if (!post) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  useEffect(() => {
    if (!post) return;
    setComments([]);

    const supabase = createClient();
    supabase
      .from("comments")
      .select("id, content, created_at, user_id, profiles(username)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setComments(data as unknown as Comment[]);
      });
  }, [post]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !currentUser || !post) return;
    setSubmitting(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: post.id, user_id: currentUser.id, content: input.trim() })
      .select("id, content, created_at, user_id, profiles(username)")
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as unknown as Comment]);
      setInput("");
    } else if (error) {
      console.error("댓글 저장 오류:", error.message);
      alert("댓글 저장에 실패했어요: " + error.message);
    }
    setSubmitting(false);
  }

  if (!post) return null;

  const yearLabel =
    post.book_year < 0
      ? `기원전 ${Math.abs(post.book_year)}년`
      : `${post.book_year}년`;

  const category = post.categories;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div
          className="w-full h-44 flex items-center justify-center shrink-0 rounded-t-2xl sm:rounded-t-2xl"
          style={{ backgroundColor: post.cover_color }}
        >
          <div className="text-center">
            <p className="text-white font-bold text-xl mb-1">{post.book_title}</p>
            <p className="text-white/70 text-sm">{post.book_author}</p>
            <p className="text-white/50 text-xs mt-1">{yearLabel}</p>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center text-sm font-bold hover:bg-black/50"
        >
          ✕
        </button>

        {/* Post info */}
        <div className="px-4 pt-4 pb-2 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <CategoryAvatar category={category} size="sm" />
            <div>
              <p className="font-semibold text-sm">{category.name}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mx-4 shrink-0" />

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              첫 번째 댓글을 남겨보세요
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <Link
                  href={`/profile/${c.user_id}`}
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 hover:opacity-70"
                >
                  {c.profiles?.username?.[0]?.toUpperCase() ?? "?"}
                </Link>
                <div>
                  <Link
                    href={`/profile/${c.user_id}`}
                    onClick={onClose}
                    className="text-xs font-semibold text-gray-900 mr-1 hover:underline"
                  >
                    {c.profiles?.username ?? "알 수 없음"}
                  </Link>
                  <span className="text-xs text-gray-700">{c.content}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(c.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input */}
        <div className="border-t border-gray-100 px-4 py-3 shrink-0">
          {currentUser ? (
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="댓글 달기..."
                className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!input.trim() || submitting}
                className="text-sm font-semibold text-blue-500 disabled:opacity-30"
              >
                게시
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="block text-center text-sm text-blue-500 font-semibold py-1"
              onClick={onClose}
            >
              로그인하고 댓글 달기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
