"use client";

import { useEffect } from "react";
import { Post } from "@/types";
import CategoryAvatar from "./CategoryAvatar";

type Props = {
  post: Post | null;
  onClose: () => void;
};

export default function PostDetailModal({ post, onClose }: Props) {
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

  if (!post) return null;

  const yearLabel =
    post.bookYear < 0
      ? `기원전 ${Math.abs(post.bookYear)}년`
      : `${post.bookYear}년`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div
          className="w-full h-52 flex items-center justify-center"
          style={{ backgroundColor: post.coverColor }}
        >
          <div className="text-center">
            <p className="text-white font-bold text-2xl mb-1">{post.bookTitle}</p>
            <p className="text-white/70 text-sm">{post.bookAuthor}</p>
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

        {/* Body */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <CategoryAvatar category={post.category} size="sm" />
            <div>
              <p className="font-semibold text-sm">{post.category.name}</p>
              <p className="text-xs text-gray-400">{post.category.description}</p>
            </div>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed mb-3">{post.content}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-3">
            <span>♥ {post.likeCount.toLocaleString()}</span>
            <span>💬 {post.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
