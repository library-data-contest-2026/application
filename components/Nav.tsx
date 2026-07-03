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
        scrolled ? "bg-[#111]" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-amber-400 font-black text-xl tracking-tight">BOOK</span>
          <span className="text-white font-black text-xl tracking-tight">RESCUE</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">이번 달 구조도서</Link>
          <Link href="/" className="hover:text-white transition-colors">장르별 탐색</Link>
          <Link href="/" className="hover:text-white transition-colors">구조 현황</Link>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          AI 구조 운영 중
        </div>
      </div>
    </nav>
  );
}
