import Nav from "@/components/Nav";
import ScrollReveal from "@/components/ScrollReveal";
import { books } from "@/data/books";
import Link from "next/link";

const PIPELINE = [
  { step: "01", label: "데이터 수집", desc: "정보나루 인기대출 5,000권(2025년 전국). 요청 파라미터·응답 해시를 매니페스트에 보존", color: "#003675" },
  { step: "02", label: "집중도 진단", desc: "로렌츠 곡선·지니계수로 인기 목록 내부의 쏠림 측정", color: "#1d77b7" },
  { step: "03", label: "ISBN 표준화", desc: "사서추천 1,453권을 ISBN-13으로 정규화(체크섬 검증). 확인 1,405 / 검토대기 5 / 미해결 89 분리 보존", color: "#3669ac" },
  { step: "04", label: "간극 분리", desc: "인기 5,000권 중 없는 사서추천 1,318건(고유 ISBN 1,363개) 추출", color: "#329bba" },
  { step: "05", label: "근거 보강·점수화", desc: "국가서지·성씨개·키워드 보강 후 99권 재발견 점수화. 근거 부족은 보강 대기로 보존", color: "#246beb" },
  { step: "06", label: "후보 편집", desc: "인기성 브릿지 990건·주제·정서 근거 293건 생성 → 사람이 10권 편집", color: "#1d77b7" },
  { step: "07", label: "AI 콘텐츠·웹 전시", desc: "북트레일러·헤비주얼 제작 → 온라인 전시 → 도서관 대출 연결", color: "#003675" },
];

const PROBLEMS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "관심의 쏠림",
    desc: "2025년 전국 인기대출 상위 10%(500권)가 전체 대출의 24.54%를 가져갑니다. 지니계수 0.2876.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    title: "추천과 대출의 간극",
    desc: "국립중앙도서관 사서가 추천한 1,453권 중 1,318권(90.7%)이 2025년 전국 인기대출 5,000권 목록에 이름이 없었습니다.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "발견 경로 부재",
    desc: "사서추천은 텍스트 목록으로만 제공됩니다. 스스로 콘텐츠를 만드는 발견의 통로가 없어 책은 그대로 잠듭니다.",
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
              { n: `${books.length}권`, l: "이번 달 구조 대상 후보" },
              { n: "1,363권", l: "데이터가 검토한 후보" },
              { n: "1,453권", l: "국립중앙도서관 사서추천 원본" },
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
            수상 경력과 사서 추천을 받은 책조차 독자를 만나지 못하고 서가에서 잠듭니다.
            정보나루 공공데이터로 실측한 결과입니다.
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
          <h2 className="text-2xl font-black text-[#1d1d1d] mb-2">재발견 지수</h2>
          <p className="text-[#868686] text-sm mb-8 max-w-2xl">
            단순 대출 순위가 아닌 두 가지 실측 지표로 <strong className="text-[#003675]">다시 만날 가치가 있는</strong> 책을 찾아냅니다.
          </p>

          {/* 선행 조건 */}
          <ScrollReveal>
            <div className="bg-white border border-[#dcdcdc] rounded-lg p-5 mb-4 shadow-sm flex items-start gap-4">
              <span className="px-2 py-0.5 bg-[#003675] text-white text-[10px] font-bold rounded shrink-0 mt-0.5">gate</span>
              <div>
                <p className="text-sm font-bold text-[#1d1d1d] mb-0.5">국립중앙도서관 사서추천 통과</p>
                <p className="text-xs text-[#868686]">사서추천 목록에 있는 도서만 대상. 같은 주제의 다른 판본이 이미 인기 목록에 있으면 제외.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* 두 지표 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              {
                label: "인기성 연결도",
                weight: "60%",
                color: "#1d77b7",
                desc: "성씨개·키워드·분류를 숫자 벡터로 변환해 2025년 인기 도서의 주제가 얼마나 가까운지 측정 (TF-IDF 코사인 유사도)",
              },
              {
                label: "콘텐츠 근거 준비도",
                weight: "40%",
                color: "#329bba",
                desc: "성씨개 길이 40% + 키워드 수 30% + 분류 정보 15% + 국가서지 등록 15%",
              },
            ].map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 100}>
                <div className="bg-white border border-[#dcdcdc] rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: m.color }} />
                    <p className="text-sm font-bold text-[#1d1d1d]">{m.label}</p>
                    <span className="ml-auto text-xs font-black" style={{ color: m.color }}>{m.weight}</span>
                  </div>
                  <p className="text-xs text-[#868686] leading-relaxed">{m.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* 공식 */}
          <ScrollReveal>
            <div className="bg-[#edf1f5] border border-[#c6c6c6] rounded-lg p-6">
              <p className="text-xs font-bold text-[#003675] uppercase tracking-widest mb-3">재발견 지수 (Core Preselection Score)</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white border border-[#dcdcdc] rounded px-4 py-2 text-sm font-semibold text-[#1d77b7]">
                  0.60 × 인기성 연결도
                </div>
                <span className="text-2xl font-black text-[#003675]">+</span>
                <div className="bg-white border border-[#dcdcdc] rounded px-4 py-2 text-sm font-semibold text-[#329bba]">
                  0.40 × 근거 준비도
                </div>
                <span className="text-2xl font-black text-[#003675]">=</span>
                <div className="rounded px-4 py-2 text-sm font-black text-white" style={{ background: "linear-gradient(-45deg, #003675, #1d77b7)" }}>
                  재발견 지수 ↑ 높을수록 우선 후보
                </div>
              </div>
              <p className="text-[10px] text-[#868686] mt-3">
                ※ 이 지수는 대출 순위가 아니라, 다시 소개할 책의 범위를 좁히기 위한 후보 발굴 지표입니다. 최종 선정은 사람이 합니다.
              </p>
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
          <p className="text-[#868686] text-sm mb-8">데이터 수집부터 독자 연결까지 7단계 프로세스</p>

          <div className="grid md:grid-cols-7 gap-2">
            {PIPELINE.map((p, i) => (
              <ScrollReveal key={p.step} delay={i * 60}>
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
              <h2 className="text-2xl font-black text-[#1d1d1d] mb-3">AI 북트레일러 제작 공정</h2>
              <p className="text-[#868686] text-sm leading-relaxed mb-6">
                국가서지·성씨개·키워드에서 확인된 맥락만 재구성하며, 책에 없는 내용은 만들지 않습니다.
              </p>
              <div className="space-y-3">
                {[
                  ["근거 추출", "국가서지 주제 + 정보나루 키워드 + 성씨개에서 주제·정서 근거 후보 (원문에 실제 있는 단어만 사용)"],
                  ["대본 작성", "대본 주제와 나레이션 대본을 작성한 AI가 이어하고 사람이 확인"],
                  ["나레이션 합성", "네이버 클로바 더빙 한국어 보이스 '패션'으로 음성 생성"],
                  ["장면 생성·편집", "Google Flow omni flash로 8초 클립 생성 → 사람이 컷 순서·길이·사운드·자막 편집 (30~60초)"],
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
              <p className="text-[10px] text-[#868686] mt-4 border-t border-[#e4e4e4] pt-3">
                이 영상은 Google Flow의 영상 생성 모델 omni flash로 장면을 생성하고, 네이버 클로바 더빙의 한국어 보이스 '패션'으로 나레이션을 합성한 뒤, 사람이 컷 순서·길이·사운드·자막을 편집해 완성했습니다(30~60초). 도서 헤비주얼은 Nano Banana(Gemini 이미지 생성 모델)로 제작한 것으로, 실존 인물·기존 캐릭터·원저작 삽화를 모사하지 않습니다. 작성한 AI는 실제 후보한 서지·성씨개·키워드에서 확인된 맥락만 재구성하며, 책에 없는 내용은 만들지 않습니다.
              </p>
            </div>
            <div className="bg-white border border-[#dcdcdc] rounded-xl p-6 shadow-sm">
              <p className="text-xs font-bold text-[#003675] uppercase tracking-widest mb-4">북트레일러 샘플 — 아쿠아리움이 문을 닫으면</p>
              <div className="aspect-video bg-[#1a2a3a] rounded-lg overflow-hidden">
                <video
                  src="https://a8cpqw0pp7ori9xy.public.blob.vercel-storage.com/%E1%84%8B%E1%85%A1%E1%84%8F%E1%85%AE%E1%84%8B%E1%85%A1%E1%84%85%E1%85%B5%E1%84%8B%E1%85%AE%E1%86%B7%20%E1%84%91%E1%85%A7%E1%86%AB%E1%84%8C%E1%85%B5%E1%86%B8%E1%84%87%E1%85%A9%E1%86%ABv2.mp4"
                  className="w-full h-full"
                  controls
                  playsInline
                  style={{ objectFit: "contain" }}
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
                { icon: "📈", title: "대출 증가", desc: "저평가 도서의 대출 증가를 목표로 합니다. 노출 전후 대출·클릭 변화를 측정해 효과를 검증할 예정이며, 현재는 측정 전 단계입니다." },
                { icon: "🎬", title: "콘텐츠 자동화", desc: "AI 파이프라인은 선별·스크립트·나레이션·장면 생성을 지원합니다. 후보 선정이 없어도 콘텐츠화하지 못한 사서추천 도서에 즉시 적용할 수 있습니다." },
                { icon: "🏛️", title: "도서관 가치 제고", desc: "데이터 기반 장서 관리 · AI 콘텐츠 생산으로 도서관의 디지털 전환을 선도합니다." },
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
