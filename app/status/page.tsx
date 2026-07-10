import { books } from "@/data/books";
import Nav from "@/components/Nav";
import Link from "next/link";

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white border border-[#dcdcdc] rounded-lg p-5 shadow-sm">
      <p className="text-xs text-[#868686] mb-1">{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-[#868686] mt-1">{sub}</p>}
    </div>
  );
}

function HBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-2 bg-[#eaeaea] rounded-full overflow-hidden flex-1">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.round((value / max) * 100)}%`, background: color }}
      />
    </div>
  );
}

export default function StatusPage() {
  const rescued = books.filter(b => b.loan_after !== null);
  const inProgress = books.filter(b => b.loan_after === null);
  const fiveStar = books.filter(b => b.librarian_stars === 5);
  const avgBefore = Math.round(books.reduce((s, b) => s + b.loan_before, 0) / books.length);

  // 구조 완료된 책의 증가율
  const rescuedBooks = books.filter(b => b.loan_after);
  const avgIncrease = rescuedBooks.length
    ? Math.round(rescuedBooks.reduce((s, b) => s + ((b.loan_after! - b.loan_before) / b.loan_before) * 100, 0) / rescuedBooks.length)
    : 0;

  // 장르별 분포
  const genreMap: Record<string, number> = {};
  books.forEach(b => { genreMap[b.genre] = (genreMap[b.genre] || 0) + 1; });
  const genres = Object.entries(genreMap).sort((a, b) => b[1] - a[1]);

  // 대출 최대값 (바 차트 스케일)
  const maxLoan = Math.max(...books.flatMap(b => [b.loan_before, b.loan_after ?? 0]), 50);

  // 저평가 순위 (낮을수록 더 잠든)
  const deepest = [...books].sort((a, b) => a.loan_percentile - b.loan_percentile);

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
          <h1 className="text-3xl font-black text-[#1d1d1d] mb-1">구조 현황 대시보드</h1>
          <p className="text-[#868686] text-sm">정보나루 빅데이터 기반 저평가 도서 발굴 및 대출 증가 현황</p>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="총 발굴 도서" value={`${books.length}권`} color="#003675" />
          <StatCard label="구조 완료" value={`${rescued.length}권`} sub={`대출 증가 확인`} color="#059669" />
          <StatCard label="구조 진행 중" value={`${inProgress.length}권`} sub={`AI 북트레일러 제작 중`} color="#1d77b7" />
          <StatCard label="사서 별점 5점" value={`${fiveStar.length}권`} sub={`전체 ${books.length}권 중`} color="#edb54c" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* 책별 대출 현황 */}
          <div className="bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#eaeaea]" style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
              <h2 className="text-sm font-bold text-white">책별 대출 현황 (구조 전 → 후)</h2>
            </div>
            <div className="p-6 space-y-5">
              {books.map(book => (
                <div key={book.id}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <Link href={`/book/${book.id}`} className="text-xs font-semibold text-[#1d1d1d] hover:text-[#003675] truncate max-w-[180px]">
                      {book.title}
                    </Link>
                    <span className="text-[10px] text-[#868686] ml-2 shrink-0">
                      {book.loan_before}회 → {book.loan_after ?? "진행 중"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HBar value={book.loan_before} max={maxLoan} color="#c6c6c6" />
                    {book.loan_after ? (
                      <HBar value={book.loan_after} max={maxLoan} color="#003675" />
                    ) : (
                      <div className="h-2 flex-1 rounded-full border border-dashed border-[#c6c6c6]" />
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#868686] mt-0.5">
                    <span>구조 전</span>
                    <span className={book.loan_after ? "text-[#003675] font-semibold" : "text-[#c6c6c6]"}>
                      {book.loan_after ? `+${Math.round(((book.loan_after - book.loan_before) / book.loan_before) * 100)}%` : "대기 중"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* 장르 분포 */}
            <div className="bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#eaeaea]">
                <h2 className="text-sm font-bold text-[#1d1d1d]">장르 분포</h2>
              </div>
              <div className="p-6 space-y-3">
                {genres.map(([genre, count]) => (
                  <div key={genre}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#555] font-medium">{genre}</span>
                      <span className="text-[#868686]">{count}권</span>
                    </div>
                    <div className="h-2 bg-[#eaeaea] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(count / books.length) * 100}%`, background: "linear-gradient(-45deg, #3669ac, #329bba)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 저평가 지수 TOP 5 */}
            <div className="bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#eaeaea]">
                <h2 className="text-sm font-bold text-[#1d1d1d]">가장 깊이 잠든 책 TOP 5</h2>
                <p className="text-[10px] text-[#868686] mt-0.5">대출 하위 % 기준</p>
              </div>
              <div className="divide-y divide-[#f2f4f5]">
                {deepest.slice(0, 5).map((book, i) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-[#edf1f5] transition-colors"
                  >
                    <span className="text-lg font-black text-[#dcdcdc] w-6 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1d1d1d] truncate">{book.title}</p>
                      <p className="text-[10px] text-[#868686]">{book.author} · {book.genre}</p>
                    </div>
                    <span className="text-xs font-bold text-red-500 shrink-0">하위 {book.loan_percentile}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 전체 통계 요약 */}
        <div className="rounded-lg p-6 md:p-8" style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
          <h2 className="text-white font-bold text-sm mb-4">프로젝트 성과 요약</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-white">{books.length}</p>
              <p className="text-blue-200 text-xs mt-1">발굴된 저평가 도서</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{avgBefore}회</p>
              <p className="text-blue-200 text-xs mt-1">구조 전 평균 대출</p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: "#edb54c" }}>
                {fiveStar.length}/{books.length}
              </p>
              <p className="text-blue-200 text-xs mt-1">사서 별점 5점 도서</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">
                {rescued.length > 0 ? `+${avgIncrease}%` : "진행 중"}
              </p>
              <p className="text-blue-200 text-xs mt-1">평균 대출 증가율</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
