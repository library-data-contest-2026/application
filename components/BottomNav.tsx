"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  userId?: string | null;
};

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function QuizIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function PersonIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function BottomNav({ userId }: Props) {
  const pathname = usePathname();

  const profileHref = userId ? `/profile/${userId}` : "/login";
  const isHome = pathname === "/";
  const isSearch = pathname === "/search";
  const isQuiz = pathname?.startsWith("/quiz");
  const isProfile = pathname?.startsWith("/profile");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        <Link href="/" className={`flex flex-col items-center gap-0.5 ${isHome ? "text-black" : "text-gray-400"}`}>
          <HomeIcon active={isHome} />
          <span className="text-[10px]">홈</span>
        </Link>
        <Link href="/search" className={`flex flex-col items-center gap-0.5 ${isSearch ? "text-black" : "text-gray-400"}`}>
          <SearchIcon active={!!isSearch} />
          <span className="text-[10px]">탐색</span>
        </Link>
        <Link href="/quiz" className={`flex flex-col items-center gap-0.5 ${isQuiz ? "text-black" : "text-gray-400"}`}>
          <QuizIcon active={!!isQuiz} />
          <span className="text-[10px]">퀴즈</span>
        </Link>
        <Link href={profileHref} className={`flex flex-col items-center gap-0.5 ${isProfile ? "text-black" : "text-gray-400"}`}>
          <PersonIcon active={!!isProfile} />
          <span className="text-[10px]">프로필</span>
        </Link>
      </div>
    </nav>
  );
}
