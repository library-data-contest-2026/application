"use client";

import Link from "next/link";
import { Book } from "@/data/books";

export default function Hero({ book }: { book: Book }) {
  const embedUrl = book.video_id
    ? `https://www.youtube.com/embed/${book.video_id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${book.video_id}&rel=0&iv_load_policy=3&disablekb=1`
    : null;

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-end overflow-hidden">

      {/* 배경: 비디오 or 컬러 그라디언트 */}
      {embedUrl ? (
        <div className="absolute inset-0 bg-black">
          <iframe
            src={embedUrl}
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "max(100%, 177.78vh)",
              height: "max(56.25vw, 100%)",
              pointerEvents: "none",
              border: "none",
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${book.cover_color} 0%, #111 100%)` }}
        />
      )}

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#111]/60 via-transparent to-[#111]/40" />

      {/* 구조 배지 — 우상단 */}
      <div className="absolute top-28 right-8 md:right-16 flex flex-col gap-2 items-end z-10">
        <span className="px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full tracking-wider">
          🚨 이번 달 구조도서
        </span>
        <span className="px-3 py-1 bg-black/60 border border-amber-400/50 text-amber-400 text-xs font-semibold rounded-full">
          대출순위 하위 {book.loan_percentile}%
        </span>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pb-24 w-full">
        <p className="text-amber-400 text-sm font-semibold tracking-widest mb-3 uppercase">
          잠자는 책을 깨우다
        </p>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-3 drop-shadow-2xl">
          {book.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light mb-6">
          {book.author} · {book.year}
        </p>

        {/* 사서 추천 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < book.librarian_stars ? "text-amber-400" : "text-gray-700"}`}>★</span>
            ))}
          </div>
          <span className="text-gray-300 text-sm">사서추천</span>
          <span className="text-gray-500 mx-2">·</span>
          <span className="text-amber-400 text-sm font-semibold">"{book.librarian_comment}"</span>
        </div>

        <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed mb-8">
          {book.summary}
        </p>

        {/* 구조 전 상황 */}
        <div className="flex items-center gap-3 mb-8 p-3 bg-white/5 border border-white/10 rounded-xl w-fit">
          <div className="text-center px-4 border-r border-white/10">
            <p className="text-2xl font-black text-gray-400">{book.loan_before}회</p>
            <p className="text-xs text-gray-500 mt-0.5">구조 전 대출</p>
          </div>
          <div className="px-4">
            <p className="text-xs text-gray-400 mb-0.5">지난 1년간 대출</p>
            <p className="text-sm font-semibold text-white">이 책을 깨워주세요.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Link
            href={`/book/${book.id}`}
            className="flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-lg transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            구조하기
          </Link>
          <Link
            href={`/book/${book.id}`}
            className="flex items-center gap-2 px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors text-sm backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            상세 정보
          </Link>
        </div>
      </div>

      {/* 장르 태그 */}
      <div className="absolute bottom-6 right-8 md:right-16 flex gap-2 z-10">
        {book.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2.5 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/10">
            #{tag}
          </span>
        ))}
      </div>
    </section>
  );
}
