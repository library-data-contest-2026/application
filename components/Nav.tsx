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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b border-[#dcdcdc] shadow-sm"
          : "bg-[#f2f4f5]/80 backdrop-blur-sm border-b border-[#e4e4e4]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">

        {/* 왼쪽: 국립중앙도서관 로고 + Book Rescue */}
        <div className="flex items-center gap-3">
          <img src="/nl-logo.png" alt="국립중앙도서관" className="h-8 w-auto" />
          <div className="w-px h-6 bg-[#dcdcdc]" />
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-[#003675] font-black text-lg tracking-tight">BOOK</span>
            <span className="text-[#1d1d1d] font-black text-lg tracking-tight">RESCUE</span>
          </Link>
        </div>

        {/* 가운데 메뉴 */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#555]">
          <Link href="/" className="hover:text-[#003675] transition-colors py-1 border-b-2 border-transparent hover:border-[#003675]">이번 달 구조도서</Link>
          <Link href="/genres" className="hover:text-[#003675] transition-colors py-1 border-b-2 border-transparent hover:border-[#003675]">장르별 탐색</Link>
          <Link href="/status" className="hover:text-[#003675] transition-colors py-1 border-b-2 border-transparent hover:border-[#003675]">구조 현황</Link>
          <Link href="/about" className="hover:text-[#003675] transition-colors py-1 border-b-2 border-transparent hover:border-[#003675]">소개</Link>
        </div>

        {/* 오른쪽: AI 운영 상태 */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#868686]">
          <span className="w-2 h-2 rounded-full bg-[#1d77b7] animate-pulse" />
          AI 구조 운영 중
        </div>
      </div>
    </nav>
  );
}
