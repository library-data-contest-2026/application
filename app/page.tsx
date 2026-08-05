import { books, monthlyPick, weeklyNew } from "@/data/books";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BookRow from "@/components/BookRow";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  const nonPick = books.filter((b) => !b.is_monthly_pick);
  const byScore = [...nonPick].sort((a, b) => b.rediscovery_score - a.rediscovery_score);
  // 사서추천 분야 기준 (중복 없이)
  const naturalSci = nonPick.filter((b) => b.librarian_field === "자연과학");
  const humHum = nonPick.filter((b) => b.librarian_field === "인문학");
  const humSci = nonPick.filter((b) => b.librarian_field === "인문과학");

  return (
    <main className="bg-[#f2f4f5] min-h-screen">
      {/* 공모전 안내 배너 */}
      <div className="text-white text-xs text-center py-2 px-4 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
        <span className="opacity-90">2026 도서관 데이터 활용 공모전 출품작</span>
        <span className="opacity-40">|</span>
        <span className="font-semibold">국립중앙도서관 · 정보나루 빅데이터 활용</span>
      </div>
      <Nav />
      <Hero book={monthlyPick} />

      {/* 통계 배너 */}
      <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-16 py-8">
        <div className="grid grid-cols-3 gap-0 bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
          <div className="text-center py-6 px-4">
            <p className="text-2xl md:text-3xl font-black text-[#003675]">{books.length}권</p>
            <p className="text-xs text-[#868686] mt-1">이번 달 구조 도서</p>
          </div>
          <div className="text-center py-6 px-4 border-x border-[#e4e4e4]">
            <p className="text-2xl md:text-3xl font-black text-[#1d1d1d]">1,363권</p>
            <p className="text-xs text-[#868686] mt-1">데이터가 검토한 후보</p>
          </div>
          <div className="text-center py-6 px-4">
            <p className="text-2xl md:text-3xl font-black text-emerald-600">24.54%</p>
            <p className="text-xs text-[#868686] mt-1">인기 상위 10%가 가져간 대출</p>
          </div>
        </div>
      </ScrollReveal>

      {/* 책 열들 */}
      <div className="pb-20 space-y-2">
        <BookRow title="이번 주 새롭게 구조된 책" books={weeklyNew.filter(b => !b.is_monthly_pick)} />
        <BookRow title="재발견 지수 높은 순" books={byScore} />
        <BookRow title="자연과학 분야 사서추천" books={naturalSci} />
        <BookRow title="인문학 분야 사서추천" books={humHum} />
        <BookRow title="인문과학 분야 사서추천" books={humSci} />
      </div>

      {/* 푸터 */}
      <footer className="border-t border-[#dcdcdc] bg-white pt-10 pb-8 px-6 md:px-16 text-[#868686] text-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div className="flex flex-col gap-3">
              <img src="/nl-logo.png" alt="국립중앙도서관" className="h-9 w-auto" />
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#1d1d1d] font-black text-sm tracking-tight">BOOK RESCUE</span>
                <span className="px-2 py-0.5 bg-[#003675] text-white text-[10px] font-semibold rounded">공모전 출품작</span>
              </div>
              <p className="text-[#868686] max-w-sm leading-relaxed">
                데이터가 발견하고 AI가 되살리는 도서관 콘텐츠.<br />
                저평가된 책을 발굴해 독자와 연결합니다.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#555] font-semibold mb-1 text-xs">데이터 출처</p>
              <a href="https://www.nl.go.kr/NL/contents/N31601000000.do" target="_blank" rel="noreferrer" className="hover:text-[#003675] transition-colors">국립중앙도서관 사서추천도서 · 국가서지</a>
              <a href="https://www.data4library.kr/" target="_blank" rel="noreferrer" className="hover:text-[#003675] transition-colors">도서관 정보나루 인기대출도서 · 도서관이용자료 · 도서키워드</a>
            </div>
          </div>
          <div className="border-t border-[#eaeaea] pt-6 flex flex-col md:flex-row justify-between gap-2">
            <p>© 2026 Book Rescue · 2026 도서관 데이터 활용 공모전 출품작</p>
            <p>데이터 출처: 국립중앙도서관 사서추천도서·국가서지 / 정보나루 인기대출도서·도서관이용자료·도서키워드 · 비상업적 교육 목적</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
