"use client";

import { useRouter } from "next/navigation";
import { Book } from "@/data/books";

export default function BookCard({ book }: { book: Book }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/book/${book.id}`)}
      className="group relative flex-shrink-0 w-40 md:w-48 cursor-pointer"
    >
      {/* 책 커버 */}
      <div
        className="w-full aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/80"
        style={{ background: `linear-gradient(160deg, ${book.cover_color} 0%, #000 100%)` }}
      >
        {/* 책 표지 내용 */}
        <div className="w-full h-full flex flex-col justify-between p-3">
          <div>
            {book.is_monthly_pick && (
              <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full">이달의 구조</span>
            )}
            {book.is_weekly_new && !book.is_monthly_pick && (
              <span className="text-[9px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-full">NEW</span>
            )}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow">{book.title}</p>
            <p className="text-white/60 text-xs mt-1">{book.author}</p>
          </div>
        </div>

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-end p-3">
          <p className="text-white font-bold text-sm leading-tight mb-1">{book.title}</p>
          <p className="text-gray-300 text-xs mb-2">{book.author}</p>

          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] text-red-400 font-semibold">대출 하위 {book.loan_percentile}%</span>
            <span className="text-gray-600 text-[10px]">·</span>
            <span className="text-[10px] text-amber-400">{"★".repeat(book.librarian_stars)}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {book.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[9px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>

          <button className="w-full py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-md transition-colors">
            ▶ 구조하기
          </button>
        </div>
      </div>

      {/* 카드 하단 텍스트 (호버 전 표시) */}
      <div className="mt-2 group-hover:opacity-0 transition-opacity">
        <p className="text-white text-xs font-medium truncate">{book.title}</p>
        <p className="text-gray-500 text-[11px] mt-0.5">{book.genre}</p>
      </div>
    </div>
  );
}
