"use client";

import { useState } from "react";
import Link from "next/link";
import { Book } from "@/data/books";
import Nav from "@/components/Nav";
import BookCard from "@/components/BookCard";

const scoreLabels: Record<string, string> = {
  loan: "대출량",
  rating: "평점",
  librarian: "사서추천",
  awards: "수상경력",
  keywords: "키워드 다양성",
};

const scoreColors: Record<string, string> = {
  loan: "bg-red-400",
  rating: "bg-blue-400",
  librarian: "bg-[#003087]",
  awards: "bg-purple-400",
  keywords: "bg-emerald-400",
};

type Props = {
  book: Book;
  similarBooks: Book[];
};

export default function BookDetailClient({ book, similarBooks }: Props) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="bg-[#F5F7FA] min-h-screen text-gray-900">
      <Nav />

      {/* 히어로 */}
      <div
        className="relative w-full pt-20 pb-16 px-6 md:px-16"
        style={{ background: `linear-gradient(135deg, ${book.cover_color}40 0%, #F5F7FA 60%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F5F7FA]" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-start">

          {/* 책 커버 */}
          <div
            className="w-40 md:w-56 aspect-[2/3] rounded-xl shrink-0 shadow-2xl flex flex-col justify-between p-4"
            style={{ background: `linear-gradient(160deg, ${book.cover_color} 0%, #000 100%)` }}
          >
            <div />
            <div>
              <p className="text-white font-bold text-base leading-tight">{book.title}</p>
              <p className="text-white/60 text-xs mt-1">{book.author}</p>
            </div>
          </div>

          {/* 정보 */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-full">
                대출 하위 {book.loan_percentile}%
              </span>
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-[#003087] text-xs font-semibold rounded-full">
                {"★".repeat(book.librarian_stars)} 사서추천
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                {book.genre}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-2 text-gray-900">{book.title}</h1>
            <p className="text-gray-500 text-lg mb-6">{book.author} · {book.year}</p>

            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-xl">{book.summary}</p>

            {/* 구조 전/후 */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-white border border-gray-200 rounded-xl w-fit shadow-sm">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-300">{book.loan_before}</p>
                <p className="text-xs text-gray-400 mt-1">구조 전 대출</p>
              </div>
              <div className="text-gray-300 text-2xl">→</div>
              <div className="text-center">
                {book.loan_after ? (
                  <>
                    <p className="text-3xl font-black text-emerald-500">{book.loan_after}</p>
                    <p className="text-xs text-emerald-500 mt-1">구조 후 대출</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-black text-[#003087]">?</p>
                    <p className="text-xs text-blue-400 mt-1">구조 진행 중</p>
                  </>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowVideo(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#003087] hover:bg-[#002270] text-white font-bold rounded-lg transition-colors shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                30초 예고편
              </button>
              <a
                href={book.library_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors border border-gray-300 shadow-sm"
              >
                도서관에서 대출하기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 space-y-16">

        {/* 왜 선정됐을까? */}
        <section>
          <h2 className="text-xl font-bold mb-1 text-gray-900">왜 이 책이 선정됐을까?</h2>
          <p className="text-gray-400 text-sm mb-8">"좋은데 안 읽히네" — AI가 발견한 불균형</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
            {(Object.entries(book.scores) as [string, number][]).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">{scoreLabels[key]}</span>
                  <span className={`font-bold ${key === "loan" ? "text-red-500" : "text-gray-700"}`}>
                    {key === "loan" ? `하위 ${value}%` : `${value}점`}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${scoreColors[key]}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                {key === "loan" && (
                  <p className="text-xs text-red-400 mt-1">← 낮을수록 더 잠든 책</p>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100">
              <p className="text-[#003087] text-sm font-semibold">" {book.rescue_reason} "</p>
            </div>
          </div>
        </section>

        {/* AI 북트레일러 */}
        <section>
          <h2 className="text-xl font-bold mb-1 text-gray-900">AI 북트레일러</h2>
          <p className="text-gray-400 text-sm mb-6">키워드 → LLM 스크립트 → TTS·모션그래픽으로 자동 생성된 30초 예고편</p>

          {book.video_id ? (
            <div className="aspect-video w-full max-w-2xl rounded-2xl overflow-hidden bg-black shadow-xl border border-gray-200">
              <iframe
                src={`https://www.youtube.com/embed/${book.video_id}?rel=0`}
                className="w-full h-full"
                allow="encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              onClick={() => setShowVideo(!showVideo)}
              className="relative aspect-video w-full max-w-2xl rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center cursor-pointer group hover:border-[#003087] transition-colors bg-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${book.cover_color}15 0%, #F5F7FA 100%)` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#003087]/10 border-2 border-[#003087] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#003087]/20 transition-colors">
                  <svg className="w-7 h-7 text-[#003087] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold text-sm">{book.title}</p>
                <p className="text-gray-400 text-xs mt-1">AI 북트레일러 — 준비 중</p>
              </div>
            </div>
          )}
        </section>

        {/* 비슷한 인기책 */}
        {similarBooks.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-1 text-gray-900">비슷한 인기책을 읽었다면</h2>
            <p className="text-gray-400 text-sm mb-6">
              <span className="text-gray-700 font-semibold">{book.similar_books[0]}</span>을 좋아하셨다면 이 책도 당신이 놓쳤을 수 있어요.
            </p>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {similarBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}

        {/* 태그 */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-900">키워드</h2>
          <div className="flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-500 text-sm rounded-full hover:border-[#003087] hover:text-[#003087] transition-colors cursor-pointer shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-[#003087] text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            다른 구조 도서 보기
          </Link>
        </div>
      </div>

      {/* 비디오 모달 */}
      {showVideo && !book.video_id && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowVideo(false)}>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-2xl mb-3">🎬</p>
            <p className="font-bold text-gray-900 mb-2">북트레일러 준비 중</p>
            <p className="text-gray-400 text-sm mb-6">AI가 이 책의 예고편을 생성하고 있습니다.</p>
            <a
              href={book.library_url}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 bg-[#003087] text-white font-bold rounded-lg text-sm hover:bg-[#002270] transition-colors"
            >
              지금 바로 도서관에서 대출하기
            </a>
            <button onClick={() => setShowVideo(false)} className="mt-3 text-gray-400 text-sm hover:text-gray-700">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
