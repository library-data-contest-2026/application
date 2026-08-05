import { books } from "@/data/books";
import Nav from "@/components/Nav";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white border border-[#dcdcdc] rounded-lg p-5 shadow-sm">
      <p className="text-xs text-[#868686] mb-1">{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-[#868686] mt-1">{sub}</p>}
    </div>
  );
}

export default function StatusPage() {
  const withVideo = books.filter(b => b.video_path !== null);
  const withoutVideo = books.filter(b => b.video_path === null);

  // 재발견 지수 순위 (높을수록 먼저)
  const byScore = [...books].sort((a, b) => b.rediscovery_score - a.rediscovery_score);

  // 사서추천 분야별 분포
  const fieldMap: Record<string, number> = {};
  books.forEach(b => { fieldMap[b.librarian_field] = (fieldMap[b.librarian_field] || 0) + 1; });
  const fields = Object.entries(fieldMap).sort((a, b) => b[1] - a[1]);

  // 분야별 평균 재발견 지수
  const fieldAvg: Record<string, number> = {};
  Object.keys(fieldMap).forEach(field => {
    const fb = books.filter(b => b.librarian_field === field);
    fieldAvg[field] = Math.round(fb.reduce((s, b) => s + b.rediscovery_score, 0) / fb.length * 10) / 10;
  });

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
          <p className="text-[#868686] text-sm">국립중앙도서관 사서추천 · 정보나루 데이터 기반 후보 선정 현황</p>
        </div>

        {/* 요약 통계 */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="이번 달 선정 후보" value={`${books.length}권`} color="#003675" />
            <StatCard label="북트레일러 완성" value={`${withVideo.length}권`} sub="AI 제작 완료" color="#059669" />
            <StatCard label="제작 예정" value={`${withoutVideo.length}권`} sub="콘텐츠 준비 중" color="#1d77b7" />
            <StatCard label="사서추천 통과" value={`${books.length} / ${books.length}권`} sub="전원 통과" color="#edb54c" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* 재발견 지수 순위 */}
          <div className="bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#eaeaea]" style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
              <h2 className="text-sm font-bold text-white">재발견 지수 순위</h2>
              <p className="text-blue-200 text-[10px] mt-0.5">0.60 × 인기성 연결도 + 0.40 × 콘텐츠 근거 준비도</p>
            </div>
            <div className="p-6 space-y-4">
              {byScore.map((book, i) => (
                <div key={book.id}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-black text-[#dcdcdc] w-4 shrink-0">{i + 1}</span>
                      <Link href={`/book/${book.id}`} className="text-xs font-semibold text-[#1d1d1d] hover:text-[#003675] truncate">
                        {book.title}
                      </Link>
                    </div>
                    <span className="text-xs font-black text-[#003675] ml-2 shrink-0">{book.rediscovery_score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-[#eaeaea] rounded-full overflow-hidden flex-1">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${book.rediscovery_score}%`, background: "linear-gradient(-45deg, #003675, #1d77b7)" }}
                      />
                    </div>
                    <span className="text-[10px] text-[#868686] shrink-0 w-12 text-right">{book.rediscovery_rank}위</span>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-[#868686] pt-3 border-t border-[#f2f4f5]">
                ※ 이 지수는 후보 발굴 지표입니다. 최종 선정은 사람이 합니다.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 사서추천 분야 분포 */}
            <div className="bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#eaeaea]">
                <h2 className="text-sm font-bold text-[#1d1d1d]">사서추천 분야 분포</h2>
              </div>
              <div className="p-6 space-y-3">
                {fields.map(([field, count]) => (
                  <div key={field}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#555] font-medium">{field}</span>
                      <span className="text-[#868686]">{count}권 · 평균 지수 {fieldAvg[field]}</span>
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

            {/* 재발견 지수 TOP 5 */}
            <div className="bg-white border border-[#dcdcdc] rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#eaeaea]">
                <h2 className="text-sm font-bold text-[#1d1d1d]">재발견 지수 TOP 5</h2>
                <p className="text-[10px] text-[#868686] mt-0.5">전체 99권 후보 중 순위</p>
              </div>
              <div className="divide-y divide-[#f2f4f5]">
                {byScore.slice(0, 5).map((book, i) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-[#edf1f5] transition-colors"
                  >
                    <span className="text-lg font-black text-[#dcdcdc] w-6 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1d1d1d] truncate">{book.title}</p>
                      <p className="text-[10px] text-[#868686]">{book.librarian_field} · {book.rediscovery_rank}위</p>
                    </div>
                    <span className="text-xs font-black text-[#003675] shrink-0">{book.rediscovery_score}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 선정 현황 요약 */}
        <ScrollReveal>
          <div className="rounded-lg p-6 md:p-8" style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
            <h2 className="text-white font-bold text-sm mb-4">선정 현황 요약</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-white">{books.length}권</p>
                <p className="text-blue-200 text-xs mt-1">이번 달 구조 대상 후보</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{withVideo.length}권</p>
                <p className="text-blue-200 text-xs mt-1">북트레일러 완성</p>
              </div>
              <div>
                <p className="text-3xl font-black" style={{ color: "#edb54c" }}>
                  {books.length} / {books.length}
                </p>
                <p className="text-blue-200 text-xs mt-1">사서추천 통과</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">측정 전</p>
                <p className="text-blue-200 text-xs mt-1">노출 후 대출 변화</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
