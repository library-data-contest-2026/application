import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LibFeed",
  description: "도서관 데이터로 만든 책 피드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
