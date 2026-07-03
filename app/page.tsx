import { books, monthlyPick, weeklyNew } from "@/data/books";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BookRow from "@/components/BookRow";

export default function Home() {
  const literature = books.filter((b) => ["문학", "소설", "성장소설"].includes(b.genre));
  const thriller = books.filter((b) => ["추리", "스릴러"].includes(b.genre));
  const history = books.filter((b) => b.genre === "역사소설");
  const allBooks = [...books].sort((a, b) => a.loan_percentile - b.loan_percentile);

  return (
    <main className="bg-[#111] min-h-screen">
      {/* 공모전 안내 배너 */}
      <div className="bg-[#003087] text-white text-xs text-center py-2 px-4 flex items-center justify-center gap-2">
        <span className="opacity-80">2026 도서관 데이터 활용 공모전 출품작</span>
        <span className="opacity-40">|</span>
        <span className="font-semibold">국립중앙도서관 · 정보나루 빅데이터 활용</span>
      </div>
      <Nav />
      <Hero book={monthlyPick} />

      {/* 통계 배너 */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-8">
        <div className="grid grid-cols-3 gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-amber-400">{books.length}권</p>
            <p className="text-xs text-gray-500 mt-1">이번 달 구조 도서</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-2xl md:text-3xl font-black text-white">12,311</p>
            <p className="text-xs text-gray-500 mt-1">누적 조회 수</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-emerald-400">+41%</p>
            <p className="text-xs text-gray-500 mt-1">평균 대출 증가율</p>
          </div>
        </div>
      </div>

      {/* 책 열들 */}
      <div className="pb-20 space-y-2">
        <BookRow title="🚨 이번 주 새롭게 구조된 책" books={weeklyNew} />
        <BookRow title="📚 가장 깊이 잠든 책들" books={allBooks} />
        <BookRow title="✍️ 문학 속 숨겨진 명작" books={literature} />
        <BookRow title="🔍 추리·스릴러 속 잠든 책" books={thriller} />
        <BookRow title="📜 역사 속 묻힌 이야기" books={history} />
      </div>

      {/* 푸터 */}
      <footer className="border-t border-white/10 pt-10 pb-8 px-6 md:px-16 text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto">

          {/* 상단: 로고 + 설명 + 링크 */}
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-base tracking-tight">BOOK RESCUE</span>
                <span className="px-2 py-0.5 bg-[#003087] text-white text-[10px] font-semibold rounded">국립중앙도서관</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                데이터가 발견하고 AI가 되살리는 도서관 콘텐츠.<br />
                저평가된 책을 발굴해 독자와 연결합니다.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-gray-400 font-semibold mb-1">데이터 출처</p>
              <a href="https://www.data4library.kr/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">정보나루 (도서관 빅데이터)</a>
              <a href="https://www.nl.go.kr/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">국립중앙도서관</a>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between gap-2">
            <p>© 2026 Book Rescue · 2026 도서관 데이터 활용 공모전 출품작</p>
            <p>데이터 출처: 국립중앙도서관 정보나루 공공데이터 · 비상업적 교육 목적</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
