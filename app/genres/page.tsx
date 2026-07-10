"use client";

import { useState } from "react";
import { books } from "@/data/books";
import Nav from "@/components/Nav";
import BookCard from "@/components/BookCard";

const GENRE_COLORS: Record<string, string> = {
  "문학":    "#3669ac",
  "성장소설": "#329bba",
  "SF":      "#1d77b7",
  "추리":    "#1f53cc",
  "스릴러":  "#003675",
  "역사소설": "#246beb",
  "소설":    "#3669ac",
};

function getGenreColor(genre: string) {
  return GENRE_COLORS[genre] ?? "#003675";
}

export default function GenresPage() {
  const allGenres = Array.from(new Set(books.map(b => b.genre)));
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected ? books.filter(b => b.genre === selected) : books;

  const genreStats = allGenres.map(genre => {
    const gb = books.filter(b => b.genre === genre);
    const avgPercentile = Math.round(gb.reduce((s, b) => s + b.loan_percentile, 0) / gb.length);
    return { genre, count: gb.length, avgPercentile };
  }).sort((a, b) => a.avgPercentile - b.avgPercentile);

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <Nav />

      <div className="pt-20 pb-16 px-6 md:px-16 max-w-7xl mx-auto">

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(-45deg, #3669ac, #329bba)" }} />
            <p className="text-xs font-bold tracking-widest text-[#003675] uppercase">국립중앙도서관 · 도서 구조 프로젝트</p>
          </div>
          <h1 className="text-3xl font-black text-[#1d1d1d] mb-1">장르별 탐색</h1>
          <p className="text-[#868686] text-sm">장르별로 잠든 책을 발견해보세요</p>
        </div>

        {/* 장르 카드 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => setSelected(null)}
            className="rounded-lg p-4 text-left transition-all border shadow-sm"
            style={!selected
              ? { background: "linear-gradient(-45deg, #003675, #1d77b7)", border: "none", color: "white" }
              : { background: "white", borderColor: "#dcdcdc", color: "#555" }
            }
          >
            <p className="text-xl font-black mb-0.5">{books.length}</p>
            <p className="text-xs font-semibold">전체 도서</p>
            <p className="text-[10px] mt-1 opacity-60">모든 장르 보기</p>
          </button>

          {genreStats.map(({ genre, count, avgPercentile }) => (
            <button
              key={genre}
              onClick={() => setSelected(genre === selected ? null : genre)}
              className="rounded-lg p-4 text-left transition-all border shadow-sm"
              style={selected === genre
                ? { background: getGenreColor(genre), border: "none", color: "white" }
                : { background: "white", borderColor: "#dcdcdc", color: "#555" }
              }
            >
              <p className="text-xl font-black mb-0.5">{count}</p>
              <p className="text-xs font-semibold">{genre}</p>
              <p className="text-[10px] mt-1 opacity-60">평균 하위 {avgPercentile}%</p>
            </button>
          ))}
        </div>

        {/* 선택된 장르 정보 */}
        {selected && (
          <div className="mb-6 p-4 bg-[#edf1f5] border border-[#c6c6c6] rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-[#003675] font-bold">{selected}</span>
              <span className="text-xs text-[#868686] ml-2">— {filtered.length}권의 저평가 도서 발굴됨</span>
            </div>
            <button onClick={() => setSelected(null)} className="text-xs text-[#868686] hover:text-[#003675]">
              전체 보기 ×
            </button>
          </div>
        )}

        {/* 도서 목록 */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-12">
          {filtered.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {/* 장르별 상세 통계 */}
        <div className="bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#eaeaea]">
            <h2 className="text-sm font-bold text-[#1d1d1d]">장르별 저평가 현황</h2>
            <p className="text-[10px] text-[#868686] mt-0.5">평균 대출 하위 % 기준 — 낮을수록 더 잠든 장르</p>
          </div>
          <div className="divide-y divide-[#f2f4f5]">
            {genreStats.map(({ genre, count, avgPercentile }) => (
              <button
                key={genre}
                onClick={() => setSelected(genre === selected ? null : genre)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#edf1f5] transition-colors text-left"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: getGenreColor(genre) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[#1d1d1d]">{genre}</span>
                    <span className="text-xs text-[#868686]">{count}권 · 평균 하위 {avgPercentile}%</span>
                  </div>
                  <div className="h-2 bg-[#eaeaea] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${avgPercentile}%`, background: getGenreColor(genre) }}
                    />
                  </div>
                </div>
                <span className="text-xs text-red-500 font-bold shrink-0">하위 {avgPercentile}%</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
