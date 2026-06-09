"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { User } from "@supabase/supabase-js";
import CategoryAvatar from "./CategoryAvatar";

type Props = {
  post: Post;
  user: User | null;
  onOpenDetail: (post: Post) => void;
};

export default function PostCard({ post, user, onOpenDetail }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  function handleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  const yearLabel =
    post.bookYear < 0
      ? `기원전 ${Math.abs(post.bookYear)}년`
      : `${post.bookYear}년`;

  return (
    <article className="bg-white border border-gray-200 rounded-none sm:rounded-xl mb-0 sm:mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <CategoryAvatar category={post.category} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">
            {post.category.name}
          </p>
          <p className="text-xs text-gray-400">{yearLabel}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-xl leading-none">
          ···
        </button>
      </div>

      {/* Book Cover */}
      <div
        className="w-full aspect-square flex flex-col items-center justify-center cursor-pointer select-none"
        style={{ backgroundColor: post.coverColor }}
        onClick={() => onOpenDetail(post)}
      >
        <div className="w-40 bg-white/10 backdrop-blur rounded-lg p-6 shadow-2xl text-center">
          <p className="text-white font-bold text-xl leading-tight mb-2">
            {post.bookTitle}
          </p>
          <p className="text-white/70 text-sm">{post.bookAuthor}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex items-center gap-4">
        {user ? (
          <button
            onClick={handleLike}
            className={`text-2xl transition-transform active:scale-125 ${liked ? "text-red-500" : "text-gray-800"}`}
          >
            {liked ? "♥" : "♡"}
          </button>
        ) : (
          <Link href="/login" className="text-2xl text-gray-800">♡</Link>
        )}
        <button
          onClick={() => onOpenDetail(post)}
          className="text-2xl text-gray-800"
        >
          💬
        </button>
      </div>

      {/* Like count */}
      <div className="px-4 pb-1">
        <p className="text-sm font-semibold text-gray-900">
          좋아요 {likeCount.toLocaleString()}개
        </p>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 leading-relaxed">
          <span className="font-semibold mr-1">{post.category.name}</span>
          {post.content}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-blue-500">
              #{tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => onOpenDetail(post)}
          className="text-sm text-gray-400 mt-1"
        >
          댓글 {post.commentCount}개 모두 보기
        </button>
      </div>
    </article>
  );
}
