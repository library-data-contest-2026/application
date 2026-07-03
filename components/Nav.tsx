"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white border-b border-gray-200 shadow-sm"
          : "bg-gradient-to-b from-white/70 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* 왼쪽: 국립중앙도서관 로고 + Book Rescue */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded px-2 py-1 shadow-sm border border-gray-100">
            <img src="/nl-logo.png" alt="국립중앙도서관" className="h-7 w-auto" />
          </div>
          <div className="w-px h-6 bg-gray-300" />
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-[#003087] font-black text-lg tracking-tight">BOOK</span>
            <span className="text-gray-800 font-black text-lg tracking-tight">RESCUE</span>
          </Link>
        </div>

        {/* 가운데 메뉴 */}
        <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${
          scrolled ? "text-gray-600" : "text-gray-700"
        }`}>
          <Link href="/" className="hover:text-[#003087] transition-colors">이번 달 구조도서</Link>
          <Link href="/" className="hover:text-[#003087] transition-colors">장르별 탐색</Link>
          <Link href="/" className="hover:text-[#003087] transition-colors">구조 현황</Link>
        </div>

        {/* 오른쪽: AI 운영 상태 */}
        <div className={`flex items-center gap-2 text-xs font-medium ${scrolled ? "text-gray-500" : "text-gray-600"}`}>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          AI 구조 운영 중
        </div>
      </div>
    </nav>
  );
}
