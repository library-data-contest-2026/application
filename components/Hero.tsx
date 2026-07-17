"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Book } from "@/data/books";

export default function Hero({ book }: { book: Book }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(true);

  const hasLocalVideo = !!book.video_path;
  const embedUrl = !hasLocalVideo && book.video_id
    ? `https://www.youtube.com/embed/${book.video_id}?autoplay=0&mute=1&controls=0&loop=1&playlist=${book.video_id}&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`
    : null;

  function handleEnter() {
    setHovered(true);
    if (hasLocalVideo) videoRef.current?.play();
    else if (embedUrl) iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*"
    );
  }

  function handleLeave() {
    setHovered(false);
    if (hasLocalVideo) {
      videoRef.current?.pause();
      setMuted(true);
    } else if (embedUrl) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*"
      );
    }
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  }

  return (
    <section
      className="relative w-full h-screen min-h-[600px] flex items-end overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* 배경 */}
      {hasLocalVideo ? (
        <div className="absolute inset-0 bg-[#1a2a3a] flex items-center justify-center">
          <video
            ref={videoRef}
            src={book.video_path!}
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
          />
          {/* 음소거 토글 버튼 */}
          {hovered && (
            <button
              onClick={toggleMute}
              className="absolute bottom-8 right-8 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              {muted ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 18l1.98 2L21 18.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>
          )}
        </div>
      ) : embedUrl ? (
        <div className="absolute inset-0 bg-[#1a2a3a]">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: "max(100%, 177.78vh)", height: "max(56.25vw, 100%)", pointerEvents: "none", border: "none" }}
          />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(-45deg, #3669ac, #329bba)" }} />
      )}

      {/* 흰 오버레이 — hover 시 사라짐 (라이브러리 → 영상 전환) */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: hovered ? 0 : 1,
          background: "linear-gradient(to right, #f2f4f5 40%, rgba(242,244,245,0.88) 65%, rgba(242,244,245,0.05) 100%)",
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: hovered ? 0 : 1,
          background: "linear-gradient(to top, rgba(242,244,245,0.95) 0%, rgba(242,244,245,0.05) 30%, transparent 100%)",
        }}
      />

      {/* 영상 위 다크 그라디언트 — hover 시 나타남 (텍스트 가독성) */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: hovered ? 1 : 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: hovered ? 1 : 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)",
        }}
      />

      {/* 구조 배지 — 우상단 */}
      <div className="absolute top-28 right-8 md:right-16 flex flex-col gap-2 items-end z-10">
        <span className="px-3 py-1.5 bg-[#003675] text-white text-xs font-bold rounded tracking-wider shadow">
          이번 달 구조도서
        </span>
        <span
          className="px-3 py-1.5 text-xs font-semibold rounded shadow-sm transition-all duration-500"
          style={hovered
            ? { background: "rgba(0,0,0,0.5)", border: "1px solid rgba(252,165,165,0.5)", color: "#fca5a5" }
            : { background: "white", border: "1px solid #fecaca", color: "#dc2626" }
          }
        >
          대출순위 하위 {book.loan_percentile}%
        </span>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pb-24 w-full">

        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(-45deg, #3669ac, #329bba)" }} />
          <p
            className="text-xs font-bold tracking-widest uppercase transition-colors duration-500"
            style={{ color: hovered ? "#93c5fd" : "#003675" }}
          >
            국립중앙도서관 · 저평가 도서 발굴 프로젝트
          </p>
        </div>

        <h1
          className="text-5xl md:text-7xl font-black leading-none mb-3 transition-colors duration-500"
          style={{ color: hovered ? "#ffffff" : "#1d1d1d" }}
        >
          {book.title}
        </h1>
        <p
          className="text-xl md:text-2xl font-light mb-6 transition-colors duration-500"
          style={{ color: hovered ? "#d1d5db" : "#5d5d5d" }}
        >
          {book.author} · {book.year}
        </p>

        {/* 사서 추천 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-lg" style={{ color: i < book.librarian_stars ? "#edb54c" : "#d1d5db" }}>★</span>
            ))}
          </div>
          <span className="text-sm transition-colors duration-500" style={{ color: hovered ? "#9ca3af" : "#868686" }}>
            사서추천
          </span>
          <span className="text-gray-400 mx-2">·</span>
          <span
            className="text-sm font-semibold transition-colors duration-500"
            style={{ color: hovered ? "#93c5fd" : "#003675" }}
          >
            "{book.librarian_comment}"
          </span>
        </div>

        <p
          className="text-base md:text-lg max-w-xl leading-relaxed mb-8 transition-colors duration-500"
          style={{ color: hovered ? "#e5e7eb" : "#5d5d5d" }}
        >
          {book.summary}
        </p>

        {/* 구조 전 대출 */}
        <div
          className="flex items-center gap-3 mb-8 p-4 rounded-lg w-fit shadow-sm transition-all duration-500"
          style={hovered
            ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }
            : { background: "white", border: "1px solid #dcdcdc" }
          }
        >
          <div className="text-center px-4" style={{ borderRight: "1px solid #e4e4e4" }}>
            <p className="text-2xl font-black" style={{ color: hovered ? "#6b7280" : "#c6c6c6" }}>{book.loan_before}회</p>
            <p className="text-xs mt-0.5" style={{ color: hovered ? "#9ca3af" : "#868686" }}>구조 전 대출</p>
          </div>
          <div className="px-4">
            <p className="text-xs mb-0.5" style={{ color: hovered ? "#9ca3af" : "#868686" }}>지난 1년간 대출</p>
            <p className="text-sm font-semibold" style={{ color: hovered ? "white" : "#1d1d1d" }}>이 책을 깨워주세요.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Link
            href={`/book/${book.id}`}
            className="flex items-center gap-2 px-8 py-3 bg-[#003675] hover:bg-[#002a5c] text-white font-bold rounded transition-colors text-sm shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            구조하기
          </Link>
          <Link
            href={`/book/${book.id}`}
            className="flex items-center gap-2 px-8 py-3 font-semibold rounded transition-all text-sm"
            style={hovered
              ? { background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }
              : { background: "white", color: "#555", border: "1px solid #c6c6c6" }
            }
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
          <span
            key={tag}
            className="px-2.5 py-1 text-xs rounded transition-all duration-500"
            style={hovered
              ? { background: "rgba(0,0,0,0.4)", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.2)" }
              : { background: "rgba(255,255,255,0.9)", color: "#555", border: "1px solid #dcdcdc" }
            }
          >
            #{tag}
          </span>
        ))}
      </div>
    </section>
  );
}
