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
      <footer className="border-t border-white/10 py-8 px-6 md:px-16 text-gray-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p className="text-white font-bold mb-1">BOOK RESCUE</p>
            <p>데이터가 발견하고 AI가 되살리는 도서관 콘텐츠</p>
            <p className="mt-1">2026 도서관 데이터 활용 공모전</p>
          </div>
          <div className="flex gap-6">
            <a href="https://www.data4library.kr/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">정보나루</a>
            <a href="https://www.nl.go.kr/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">국립중앙도서관</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
