"use client";

import { useState } from "react";
import Link from "next/link";
import { Book } from "@/data/books";
import Nav from "@/components/Nav";
import BookCard from "@/components/BookCard";

type Props = {
  book: Book;
  similarBooks: Book[];
};

export default function BookDetailClient({ book, similarBooks }: Props) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="bg-[#f2f4f5] min-h-screen text-gray-900">
      <Nav />

      {/* 히어로 */}
      <div
        className="relative w-full pt-20 pb-16 px-6 md:px-16"
        style={{ background: `linear-gradient(135deg, ${book.cover_color}40 0%, #f2f4f5 60%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f2f4f5]" />
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
              <span className="px-3 py-1 bg-[#003675] text-white text-xs font-bold rounded-full">
                사서추천 · {book.librarian_field} · {book.librarian_year}
              </span>
              <span className="px-3 py-1 bg-[#edf1f5] border border-[#c6c6c6] text-[#003675] text-xs font-semibold rounded-full">
                재발견 지수 {book.rediscovery_score} · {book.rediscovery_rank}위
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-2 text-gray-900">{book.title}</h1>
            <p className="text-gray-500 text-lg mb-6">{book.author} · {book.year}</p>

            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-xl">{book.summary}</p>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowVideo(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#003675] hover:bg-[#002a5c] text-white font-bold rounded-lg transition-colors shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                북트레일러 보기
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
          <p className="text-gray-400 text-sm mb-6">국립중앙도서관 사서추천 · 정보나루 데이터 기반 재발견 지수</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">

            {/* gate */}
            <div className="flex items-start gap-3 pb-5 border-b border-gray-100">
              <span className="px-2 py-0.5 bg-[#003675] text-white text-[10px] font-bold rounded shrink-0 mt-0.5">gate</span>
              <div>
                <p className="text-sm font-bold text-gray-900">국립중앙도서관 사서추천 통과</p>
                <p className="text-xs text-gray-400 mt-0.5">{book.librarian_field} 분야 · {book.librarian_year} 선정</p>
              </div>
              <span className="ml-auto text-[#003675] font-black text-lg">✓</span>
            </div>

            {/* 두 지표 */}
            {[
              {
                label: "인기성 연결도",
                value: book.popularity_link,
                desc: "2025년 인기 도서의 주제와 얼마나 가까운가 (TF-IDF 코사인 유사도)",
                color: "#1d77b7",
              },
              {
                label: "콘텐츠 근거 준비도",
                value: book.content_readiness,
                desc: "성씨개 길이·키워드 수·분류 정보·국가서지 등록 종합",
                color: "#329bba",
              },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">{m.label}</span>
                  <span className="font-black" style={{ color: m.color }}>{m.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{m.desc}</p>
              </div>
            ))}

            {/* 재발견 지수 */}
            <div className="bg-[#edf1f5] rounded-xl p-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-bold text-[#003675]">재발견 지수</span>
                <span className="text-2xl font-black text-[#003675]">{book.rediscovery_score}</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${book.rediscovery_score}%`, background: "linear-gradient(-45deg, #003675, #1d77b7)" }} />
              </div>
              <p className="text-[11px] text-[#003675]/70">
                0.60 × 연결도 + 0.40 × 준비도 · 전체 99권 중 {book.rediscovery_rank}위
              </p>
            </div>

            <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-100">
              ※ 재발견 지수는 대출 순위가 아니라 다시 소개할 책의 범위를 좁히기 위한 후보 발굴 지표입니다. 최종 선정은 사람이 합니다.
            </p>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-[#003675] text-sm font-semibold">" {book.rescue_reason} "</p>
            </div>
          </div>
        </section>

        {/* AI 북트레일러 */}
        <section>
          <h2 className="text-xl font-bold mb-1 text-gray-900">AI 북트레일러</h2>
          <p className="text-gray-400 text-sm mb-6">Google Flow로 장면 생성 · 네이버 클로바 더빙으로 나레이션 합성 · 사람이 편집 (30~60초)</p>

          {book.video_path ? (
            <div className="w-full max-w-2xl rounded-2xl overflow-hidden bg-black shadow-xl border border-gray-200">
              <video
                src={book.video_path}
                controls
                playsInline
                className="w-full"
                style={{ objectFit: "contain", maxHeight: "480px" }}
              />
            </div>
          ) : (
            <div
              onClick={() => setShowVideo(!showVideo)}
              className="relative aspect-video w-full max-w-2xl rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center cursor-pointer group hover:border-[#003675] transition-colors bg-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${book.cover_color}15 0%, #f2f4f5 100%)` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#003675]/10 border-2 border-[#003675] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#003675]/20 transition-colors">
                  <svg className="w-7 h-7 text-[#003675] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold text-sm">{book.title}</p>
                <p className="text-gray-400 text-xs mt-1">AI 북트레일러 — 제작 예정</p>
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
              <span key={tag} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-500 text-sm rounded-full hover:border-[#003675] hover:text-[#003675] transition-colors cursor-pointer shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-[#003675] text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            다른 구조 도서 보기
          </Link>
        </div>
      </div>

      {/* 비디오 모달 */}
      {showVideo && !book.video_path && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowVideo(false)}>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-2xl mb-3">🎬</p>
            <p className="font-bold text-gray-900 mb-2">북트레일러 준비 중</p>
            <p className="text-gray-400 text-sm mb-6">AI가 이 책의 예고편을 생성하고 있습니다.</p>
            <a
              href={book.library_url}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 bg-[#003675] text-white font-bold rounded-lg text-sm hover:bg-[#002a5c] transition-colors"
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
