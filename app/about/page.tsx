import Nav from "@/components/Nav";
import ScrollReveal from "@/components/ScrollReveal";
import { books } from "@/data/books";
import Link from "next/link";

const fiveStar = books.filter(b => b.librarian_stars === 5).length;
const avgPercentile = Math.round(books.reduce((s, b) => s + b.loan_percentile, 0) / books.length);

const PIPELINE = [
  { step: "01", label: "데이터 수집", desc: "정보나루 공공 API에서 도서관별 대출 이력 · 장서 데이터 수집", color: "#003675" },
  { step: "02", label: "지표 분석", desc: "대출량·평점·사서추천·수상경력·키워드 다양성 5개 지표 산출", color: "#1d77b7" },
  { step: "03", label: "불균형 지수", desc: "가치 점수와 대출 점수의 차이로 저평가 도서 발굴", color: "#3669ac" },
  { step: "04", label: "도서 선별", desc: "불균형 지수 상위 도서를 '구조 대상'으로 지정", color: "#329bba" },
  { step: "05", label: "AI 트레일러", desc: "LLM 스크립트 → TTS 나레이션 → 모션그래픽 자동 생성", color: "#246beb" },
  { step: "06", label: "웹 전시", desc: "Book Rescue 플랫폼에서 독자와 연결 → 대출 증가", color: "#003675" },
];

const METRICS = [
  { label: "대출량", key: "loan", desc: "낮을수록 잠든 책", bad: true, color: "#dc2626" },
  { label: "평점", key: "rating", desc: "독자·전문가 평균 평점", bad: false, color: "#1d77b7" },
  { label: "사서추천", key: "librarian", desc: "담당 사서의 추천 지수", bad: false, color: "#003675" },
  { label: "수상경력", key: "awards", desc: "국내외 문학상 수상 여부", bad: false, color: "#329bba" },
  { label: "키워드 다양성", key: "keywords", desc: "도서 주제 키워드의 다양성", bad: false, color: "#3669ac" },
];

const PROBLEMS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "신간 쏠림 현상",
    desc: "전체 대출의 약 70%가 출간 1년 이내 신간에 집중됩니다. 오래된 명작은 서가에서 점점 잊힙니다.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    title: "장르 편견",
    desc: "SF·역사소설 등 특정 장르는 독자가 지레 어렵다고 판단해 대출을 기피합니다.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "발견 경로 부재",
    desc: "사서 추천·수상 이력이 있어도 독자에게 닿는 콘텐츠가 없으면 책은 그대로 잠듭니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <Nav />

      {/* 히어로 */}
      <div className="relative pt-20 pb-20 px-6 md:px-16 overflow-hidden" style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-4">2026 도서관 데이터 활용 공모전 출품작</p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            잠자는 책을<br />
            <span style={{ color: "#edb54c" }}>데이터로 깨운다</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed mb-10">
            국립중앙도서관 정보나루 빅데이터를 활용해 저평가된 도서를 발굴하고,
            AI 북트레일러로 독자와 연결하는 새로운 도서관 콘텐츠 모델입니다.
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { n: `${books.length}권`, l: "발굴된 저평가 도서" },
              { n: `하위 ${avgPercentile}%`, l: "평균 대출 순위" },
              { n: `${fiveStar}권`, l: "사서 별점 5점" },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-black text-white">{n}</p>
                <p className="text-blue-300 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 space-y-20">

        {/* 문제 정의 */}
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(-45deg, #3669ac, #329bba)" }} />
            <p className="text-xs font-bold tracking-widest text-[#003675] uppercase">Problem</p>
          </div>
          <h2 className="text-2xl font-black text-[#1d1d1d] mb-2">왜 좋은 책이 잠드는가</h2>
          <p className="text-[#868686] text-sm mb-8 max-w-2xl">
            국내 공공도서관 장서 중 상당수가 연간 대출 10회 미만입니다.
            수상 경력과 사서 추천을 받은 책조차 독자를 만나지 못하고 서가에서 잠듭니다.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {PROBLEMS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 100}>
                <div className="bg-white border border-[#dcdcdc] rounded-lg p-6 shadow-sm h-full">
                  <div className="w-10 h-10 rounded-lg bg-[#edf1f5] flex items-center justify-center mb-4 text-[#003675]">
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-[#1d1d1d] mb-2">{p.title}</h3>
                  <p className="text-[#868686] text-sm leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* 발굴 알고리즘 */}
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(-45deg, #3669ac, #329bba)" }} />
            <p className="text-xs font-bold tracking-widest text-[#003675] uppercase">Algorithm</p>
          </div>
          <h2 className="text-2xl font-black text-[#1d1d1d] mb-2">저평가 도서 발굴 알고리즘</h2>
          <p className="text-[#868686] text-sm mb-8 max-w-2xl">
            단순 대출 순위가 아닌 5개 복합 지표를 통해 <strong className="text-[#003675]">가치는 높지만 대출은 낮은</strong> 불균형 도서를 찾아냅니다.
          </p>

          {/* 지표 설명 */}
          <div className="grid md:grid-cols-5 gap-3 mb-8">
            {METRICS.map((m, i) => (
              <ScrollReveal key={m.key} delay={i * 80}>
                <div className="bg-white border border-[#dcdcdc] rounded-lg p-4 shadow-sm text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: m.color }} />
                  <p className="text-xs font-bold text-[#1d1d1d] mb-1">{m.label}</p>
                  <p className="text-[10px] text-[#868686] leading-tight">{m.desc}</p>
                  {m.bad && <p className="text-[10px] text-red-400 mt-1">↓ 낮을수록 잠든 책</p>}
                  {!m.bad && <p className="text-[10px] text-[#003675] mt-1">↑ 높을수록 가치 있는 책</p>}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* 불균형 지수 공식 */}
          <ScrollReveal>
            <div className="bg-[#edf1f5] border border-[#c6c6c6] rounded-lg p-6">
              <p className="text-xs font-bold text-[#003675] uppercase tracking-widest mb-3">불균형 지수 (Rescue Score)</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white border border-[#dcdcdc] rounded px-4 py-2 text-sm font-semibold text-[#1d1d1d]">
                  평균(평점 + 사서추천 + 수상 + 키워드)
                </div>
                <span className="text-2xl font-black text-[#003675]">−</span>
                <div className="bg-white border border-red-200 rounded px-4 py-2 text-sm font-semibold text-red-600">
                  대출량 점수
                </div>
                <span className="text-2xl font-black text-[#003675]">=</span>
                <div className="rounded px-4 py-2 text-sm font-black text-white" style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
                  Rescue Score ↑ 높을수록 구조 우선
                </div>
              </div>
            </div>
          </ScrollReveal>
        </ScrollReveal>

        {/* 전체 파이프라인 */}
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(-45deg, #3669ac, #329bba)" }} />
            <p className="text-xs font-bold tracking-widest text-[#003675] uppercase">Pipeline</p>
          </div>
          <h2 className="text-2xl font-black text-[#1d1d1d] mb-2">Book Rescue 전체 파이프라인</h2>
          <p className="text-[#868686] text-sm mb-8">데이터 수집부터 독자 연결까지 자동화된 6단계 프로세스</p>

          <div className="grid md:grid-cols-6 gap-3">
            {PIPELINE.map((p, i) => (
              <ScrollReveal key={p.step} delay={i * 80}>
                <div className="relative bg-white border border-[#dcdcdc] rounded-lg p-4 shadow-sm h-full">
                  {i < PIPELINE.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#c6c6c6] font-bold text-sm">›</div>
                  )}
                  <div className="text-xs font-black mb-2" style={{ color: p.color }}>{p.step}</div>
                  <p className="text-xs font-bold text-[#1d1d1d] mb-1.5">{p.label}</p>
                  <p className="text-[10px] text-[#868686] leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* AI 북트레일러 */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(-45deg, #3669ac, #329bba)" }} />
                <p className="text-xs font-bold tracking-widest text-[#003675] uppercase">AI Trailer</p>
              </div>
              <h2 className="text-2xl font-black text-[#1d1d1d] mb-3">자동 생성 AI 북트레일러</h2>
              <p className="text-[#868686] text-sm leading-relaxed mb-6">
                책의 키워드와 핵심 내용을 AI가 분석해 30초 나레이션 스크립트를 자동 생성하고,
                TTS 음성과 모션그래픽을 결합해 독자의 감성을 자극하는 숏폼 콘텐츠를 만듭니다.
              </p>
              <div className="space-y-3">
                {[
                  ["키워드 추출", "도서 메타데이터에서 핵심 키워드 자동 추출"],
                  ["LLM 스크립트", "Claude AI가 30초 나레이션 대본 생성"],
                  ["TTS 나레이션", "한국어 TTS로 감정 있는 음성 합성"],
                  ["모션그래픽", "키워드 기반 텍스트 애니메이션 영상 제작"],
                ].map(([title, desc], i) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#003675] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1d1d1d]">{title}</p>
                      <p className="text-[10px] text-[#868686]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#dcdcdc] rounded-xl p-6 shadow-sm">
              <p className="text-xs font-bold text-[#003675] uppercase tracking-widest mb-4">북트레일러 샘플 — 아쿠아리움이 문을 닫으면</p>
              <div className="aspect-video bg-[#1a2a3a] rounded-lg overflow-hidden">
                <video
                  src="https://a8cpqw0pp7ori9xy.public.blob.vercel-storage.com/%E1%84%8B%E1%85%A1%E1%84%8F%E1%85%AE%E1%84%8B%E1%85%A1%E1%84%85%E1%85%B5%E1%84%8B%E1%85%AE%E1%86%B7%20%E1%84%91%E1%85%A7%E1%86%AB%E1%84%8C%E1%85%B5%E1%86%B8%E1%84%87%E1%85%A9%E1%86%ABv2.mp4"
                  className="w-full h-full"
                  controls
                  playsInline
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 기대 효과 */}
        <ScrollReveal>
          <div className="rounded-xl p-8 md:p-10" style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-white/40" />
              <p className="text-blue-300 text-xs font-bold tracking-widest uppercase">Expected Impact</p>
            </div>
            <h2 className="text-2xl font-black text-white mb-6">기대 효과</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "📈", title: "대출 증가", desc: "저평가 도서의 연간 대출 3배 이상 증가 목표. 실제 구조 완료 도서 기준 평균 +215% 달성." },
                { icon: "🎬", title: "콘텐츠 자동화", desc: "AI 파이프라인으로 도서 1권당 북트레일러 제작 비용 90% 절감. 확장 가능한 모델." },
                { icon: "🏛️", title: "도서관 가치 제고", desc: "데이터 기반 장서 관리 · AI 콘텐츠 생산으로 도서관의 디지털 전환 선도." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-white/10 rounded-lg p-5">
                  <span className="text-2xl mb-3 block">{icon}</span>
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <div className="text-center py-8">
            <p className="text-[#868686] text-sm mb-4">지금 바로 구조가 필요한 책을 만나보세요</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded text-sm shadow-md transition-all hover:opacity-90"
              style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}
            >
              구조 도서 보러가기
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
