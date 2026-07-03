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
        <div className="absolute inset-0 bg-gray-900">
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
          style={{ background: `linear-gradient(-45deg, #3669ac, #329bba)` }}
        />
      )}

      {/* 오버레이: 왼쪽에서 흰 패널 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f2f4f5] via-[#f2f4f5]/92 to-[#f2f4f5]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#f2f4f5]/90 via-[#f2f4f5]/10 to-transparent" />

      {/* 구조 배지 — 우상단 */}
      <div className="absolute top-28 right-8 md:right-16 flex flex-col gap-2 items-end z-10">
        <span className="px-3 py-1.5 bg-[#003675] text-white text-xs font-bold rounded tracking-wider shadow">
          이번 달 구조도서
        </span>
        <span className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded shadow-sm">
          대출순위 하위 {book.loan_percentile}%
        </span>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pb-24 w-full">

        {/* 상단 레이블 — 국립중앙도서관 스타일 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(-45deg, #3669ac, #329bba)" }} />
          <p className="text-[#003675] text-xs font-bold tracking-widest uppercase">
            국립중앙도서관 · 저평가 도서 발굴 프로젝트
          </p>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-[#1d1d1d] leading-none mb-3">
          {book.title}
        </h1>
        <p className="text-xl md:text-2xl text-[#5d5d5d] font-light mb-6">
          {book.author} · {book.year}
        </p>

        {/* 사서 추천 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < book.librarian_stars ? "text-[#edb54c]" : "text-gray-300"}`}>★</span>
            ))}
          </div>
          <span className="text-[#868686] text-sm">사서추천</span>
          <span className="text-gray-300 mx-2">·</span>
          <span className="text-[#003675] text-sm font-semibold">"{book.librarian_comment}"</span>
        </div>

        <p className="text-[#5d5d5d] text-base md:text-lg max-w-xl leading-relaxed mb-8">
          {book.summary}
        </p>

        {/* 구조 전 상황 */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-white border border-[#dcdcdc] rounded-lg w-fit shadow-sm">
          <div className="text-center px-4 border-r border-[#e4e4e4]">
            <p className="text-2xl font-black text-[#c6c6c6]">{book.loan_before}회</p>
            <p className="text-xs text-[#868686] mt-0.5">구조 전 대출</p>
          </div>
          <div className="px-4">
            <p className="text-xs text-[#868686] mb-0.5">지난 1년간 대출</p>
            <p className="text-sm font-semibold text-[#1d1d1d]">이 책을 깨워주세요.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Link
            href={`/book/${book.id}`}
            className="flex items-center gap-2 px-8 py-3 bg-[#003675] hover:bg-[#002a5c] text-white font-bold rounded transition-colors text-sm shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            구조하기
          </Link>
          <Link
            href={`/book/${book.id}`}
            className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-[#edf1f5] text-[#555] font-semibold rounded transition-colors text-sm border border-[#c6c6c6] shadow-sm"
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
          <span key={tag} className="px-2.5 py-1 bg-white/90 text-[#555] text-xs rounded border border-[#dcdcdc]">
            #{tag}
          </span>
        ))}
      </div>
    </section>
  );
}
