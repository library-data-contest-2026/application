"use client";

import { useRef } from "react";
import { Book } from "@/data/books";
import BookCard from "./BookCard";

type Props = {
  title: string;
  books: Book[];
};

export default function BookRow({ title, books }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!rowRef.current) return;
    const amount = 400;
    rowRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  if (books.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-white font-bold text-lg md:text-xl mb-4 px-6 md:px-16">{title}</h2>

      <div className="relative group/row">
        {/* 좌측 버튼 */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-r from-[#111] to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 카드 행 */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar px-6 md:px-16 pb-2"
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {/* 우측 버튼 */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-l from-[#111] to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
