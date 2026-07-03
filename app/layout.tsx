import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Rescue — 잠자는 책을 깨우다",
  description: "데이터가 발견하고 AI가 되살리는 도서관 콘텐츠",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#111] text-white">{children}</body>
    </html>
  );
}
