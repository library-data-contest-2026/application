"use client";

import { useState } from "react";
import { books } from "@/data/books";
import Nav from "@/components/Nav";
import BookCard from "@/components/BookCard";

const FIELD_COLORS: Record<string, string> = {
  "자연과학": "#1d77b7",
  "인문학":   "#3669ac",
  "인문과학": "#329bba",
  "문학":     "#003675",
};

function getFieldColor(field: string) {
  return FIELD_COLORS[field] ?? "#003675";
}

export default function GenresPage() {
  const allFields = Array.from(new Set(books.map(b => b.librarian_field)));
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected ? books.filter(b => b.librarian_field === selected) : books;

  const fieldStats = allFields.map(field => {
    const fb = books.filter(b => b.librarian_field === field);
    const avgScore = Math.round(fb.reduce((s, b) => s + b.rediscovery_score, 0) / fb.length * 10) / 10;
    return { field, count: fb.length, avgScore };
  }).sort((a, b) => b.avgScore - a.avgScore);

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
          <h1 className="text-3xl font-black text-[#1d1d1d] mb-1">분야별 탐색</h1>
          <p className="text-[#868686] text-sm">국립중앙도서관 사서추천 분야 기준으로 잠든 책을 발견해보세요</p>
        </div>

        {/* 분야 카드 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
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
            <p className="text-[10px] mt-1 opacity-60">모든 분야 보기</p>
          </button>

          {fieldStats.map(({ field, count, avgScore }) => (
            <button
              key={field}
              onClick={() => setSelected(field === selected ? null : field)}
              className="rounded-lg p-4 text-left transition-all border shadow-sm"
              style={selected === field
                ? { background: getFieldColor(field), border: "none", color: "white" }
                : { background: "white", borderColor: "#dcdcdc", color: "#555" }
              }
            >
              <p className="text-xl font-black mb-0.5">{count}</p>
              <p className="text-xs font-semibold">{field}</p>
              <p className="text-[10px] mt-1 opacity-60">평균 재발견 지수 {avgScore}</p>
            </button>
          ))}
        </div>

        {/* 선택된 분야 정보 */}
        {selected && (
          <div className="mb-6 p-4 bg-[#edf1f5] border border-[#c6c6c6] rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-[#003675] font-bold">{selected}</span>
              <span className="text-xs text-[#868686] ml-2">— {filtered.length}권의 사서추천 후보 발굴됨</span>
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

        {/* 분야별 상세 통계 */}
        <div className="bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#eaeaea]">
            <h2 className="text-sm font-bold text-[#1d1d1d]">분야별 재발견 지수 현황</h2>
            <p className="text-[10px] text-[#868686] mt-0.5">평균 재발견 지수 기준 — 높을수록 인기 도서와 주제가 가까운 분야</p>
          </div>
          <div className="divide-y divide-[#f2f4f5]">
            {fieldStats.map(({ field, count, avgScore }) => (
              <button
                key={field}
                onClick={() => setSelected(field === selected ? null : field)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#edf1f5] transition-colors text-left"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: getFieldColor(field) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[#1d1d1d]">{field}</span>
                    <span className="text-xs text-[#868686]">{count}권 · 평균 지수 {avgScore}</span>
                  </div>
                  <div className="h-2 bg-[#eaeaea] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${avgScore}%`, background: getFieldColor(field) }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#003675] font-black shrink-0">{avgScore}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
