"use client";

import Link from "next/link";
import { Book } from "@/data/books";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/book/${book.id}`}
      className="group relative flex-shrink-0 w-40 md:w-48 cursor-pointer"
    >
      {/* 책 커버 */}
      <div
        className="w-full aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl shadow-md relative"
        style={!book.thumbnail ? { background: `linear-gradient(160deg, ${book.cover_color} 0%, #000 100%)` } : undefined}
      >
        {/* 썸네일 이미지 */}
        {book.thumbnail && (
          <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
        )}

        {/* 배지 (이미지 없을 때만) */}
        {!book.thumbnail && (
          <div className="w-full h-full flex flex-col justify-between p-3">
            <div>
              {book.is_monthly_pick && (
                <span className="text-[9px] font-bold bg-[#003675] text-white px-1.5 py-0.5 rounded-full">이달의 구조</span>
              )}
              {book.is_weekly_new && !book.is_monthly_pick && (
                <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
              )}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow">{book.title}</p>
              <p className="text-white/60 text-xs mt-1">{book.author}</p>
            </div>
          </div>
        )}

        {/* NEW 배지 (썸네일 위에) */}
        {book.thumbnail && book.is_weekly_new && (
          <span className="absolute top-2 left-2 text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/95 via-[#003087]/70 to-[#003087]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-3">
          <p className="text-white font-bold text-sm leading-tight mb-1">{book.title}</p>
          <p className="text-blue-200 text-xs mb-2">{book.author}</p>

          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] text-blue-200 font-semibold">재발견 지수 {book.rediscovery_score}</span>
            <span className="text-blue-400 text-[10px]">·</span>
            <span className="text-[10px] text-yellow-300">{"★".repeat(book.librarian_stars)}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {book.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>

          <button className="w-full py-1.5 bg-white hover:bg-blue-50 text-[#003087] text-xs font-bold rounded-md transition-colors">
            구조하기
          </button>
        </div>
      </div>

      {/* 카드 하단 텍스트 */}
      <div className="mt-2 group-hover:opacity-0 transition-opacity">
        <p className="text-gray-800 text-xs font-medium truncate">{book.title}</p>
        <p className="text-gray-400 text-[11px] mt-0.5">{book.genre}</p>
      </div>
    </Link>
  );
}
