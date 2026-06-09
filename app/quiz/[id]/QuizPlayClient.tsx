"use client";

import { useState } from "react";
import Link from "next/link";
import { Quiz } from "@/types";
import { createClient } from "@/lib/supabase-browser";
import BottomNav from "@/components/BottomNav";

type Phase = "ready" | "question" | "answered" | "finished";

type Props = {
  quiz: Quiz;
  userId: string | null;
};

const difficultyLabel: Record<string, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

const difficultyColor: Record<string, string> = {
  easy: "text-emerald-600",
  medium: "text-amber-600",
  hard: "text-red-500",
};

const optionLabel = ["A", "B", "C", "D"];

function ScoreMessage(score: number, total: number) {
  const pct = score / total;
  if (pct === 1) return { title: "완벽해요!", sub: "모든 문제를 맞혔어요." };
  if (pct >= 0.8) return { title: "훌륭해요!", sub: "거의 다 맞혔어요." };
  if (pct >= 0.6) return { title: "잘 했어요!", sub: "조금만 더 공부해봐요." };
  return { title: "다음엔 더 잘 할 수 있어요!", sub: "다시 도전해보세요." };
}

export default function QuizPlayClient({ quiz, userId }: Props) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [earnedTrophies, setEarnedTrophies] = useState<string[]>([]);

  const questions = quiz.quiz_questions;
  const total = questions.length;
  const question = questions[currentQ];

  async function finishQuiz(finalResults: boolean[]) {
    const score = finalResults.filter(Boolean).length;
    setPhase("finished");

    if (!userId) return;

    const supabase = createClient();
    const trophiesEarned: string[] = [];

    await supabase.from("quiz_attempts").insert({
      user_id: userId,
      quiz_id: quiz.id,
      score,
      total_questions: total,
    });

    const inserts: { user_id: string; trophy_id: string }[] = [];
    inserts.push({ user_id: userId, trophy_id: "first_quiz" });
    if (score === total) inserts.push({ user_id: userId, trophy_id: "perfect_score" });

    const { data: awarded } = await supabase
      .from("user_trophies")
      .upsert(inserts, { onConflict: "user_id,trophy_id", ignoreDuplicates: true })
      .select("trophy_id");

    if (awarded) trophiesEarned.push(...awarded.map((t) => t.trophy_id));
    setEarnedTrophies(trophiesEarned);
  }

  function handleSelect(idx: number) {
    if (phase !== "question") return;
    setSelectedIndex(idx);
    setPhase("answered");
  }

  function handleNext() {
    const isCorrect = selectedIndex === question.correct_index;
    const newResults = [...results, isCorrect];
    setResults(newResults);
    setSelectedIndex(null);

    if (currentQ + 1 >= total) {
      finishQuiz(newResults);
    } else {
      setCurrentQ((q) => q + 1);
      setPhase("question");
    }
  }

  function handleRestart() {
    setPhase("ready");
    setCurrentQ(0);
    setSelectedIndex(null);
    setResults([]);
    setEarnedTrophies([]);
  }

  const score = results.filter(Boolean).length;

  // ── Ready ──────────────────────────────────────────────────────────────────
  if (phase === "ready") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 max-w-lg mx-auto w-full">
          <Link href="/quiz" className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="font-semibold text-base flex-1 truncate">{quiz.title}</h2>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center gap-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
              {quiz.categories?.avatar ?? "📖"}
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">{quiz.categories?.name ?? "기타"}</p>
              <h1 className="font-bold text-lg text-gray-900 leading-snug">{quiz.title}</h1>
            </div>
            <div className="flex gap-6 text-center text-sm">
              <div>
                <p className="font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-400">문제</p>
              </div>
              <div>
                <p className={`font-bold ${difficultyColor[quiz.difficulty] ?? "text-gray-700"}`}>
                  {difficultyLabel[quiz.difficulty] ?? quiz.difficulty}
                </p>
                <p className="text-xs text-gray-400">난이도</p>
              </div>
            </div>
            <button
              onClick={() => setPhase("question")}
              className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-transform"
            >
              퀴즈 시작
            </button>
            {!userId && (
              <p className="text-xs text-gray-400 text-center">
                로그인하면 결과가 기록되고 트로피를 획득할 수 있어요.
              </p>
            )}
          </div>
        </main>

        <BottomNav userId={userId} />
      </div>
    );
  }

  // ── Finished ───────────────────────────────────────────────────────────────
  if (phase === "finished") {
    const { title, sub } = ScoreMessage(score, total);
    const pct = Math.round((score / total) * 100);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 max-w-lg mx-auto w-full">
          <Link href="/quiz" className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="font-semibold text-base">결과</h2>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24 gap-4">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center gap-5 shadow-sm">
            {/* Score circle */}
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={pct === 100 ? "#10b981" : pct >= 60 ? "#3b82f6" : "#f59e0b"}
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-gray-900">{score}/{total}</p>
                <p className="text-xs text-gray-400">{pct}%</p>
              </div>
            </div>

            <div className="text-center">
              <p className="font-bold text-lg text-gray-900">{title}</p>
              <p className="text-sm text-gray-500 mt-1">{sub}</p>
            </div>

            {/* Per-question result */}
            <div className="w-full flex gap-1.5 justify-center">
              {results.map((correct, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${correct ? "bg-emerald-400" : "bg-red-400"}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Trophy */}
            {earnedTrophies.length > 0 && (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-semibold text-amber-700">🏆 트로피 획득!</p>
                <p className="text-xs text-amber-600 mt-1">
                  {earnedTrophies.includes("perfect_score") && "만점왕 "}
                  {earnedTrophies.includes("first_quiz") && "첫 도전"}
                </p>
              </div>
            )}
          </div>

          <div className="w-full max-w-sm flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
            >
              다시 도전
            </button>
            <Link href="/quiz" className="flex-1 py-3 bg-black text-white text-sm font-semibold rounded-xl text-center hover:bg-gray-800">
              목록으로
            </Link>
          </div>
        </main>

        <BottomNav userId={userId} />
      </div>
    );
  }

  // ── Question / Answered ────────────────────────────────────────────────────
  const isAnswered = phase === "answered";
  const isLast = currentQ + 1 >= total;

  function optionStyle(idx: number) {
    if (!isAnswered) {
      return "border-gray-200 bg-white text-gray-800 hover:border-gray-400 active:scale-95";
    }
    if (idx === question.correct_index) {
      return "border-emerald-400 bg-emerald-50 text-emerald-800";
    }
    if (idx === selectedIndex) {
      return "border-red-400 bg-red-50 text-red-700";
    }
    return "border-gray-100 bg-gray-50 text-gray-400";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 max-w-lg mx-auto w-full">
        <Link href="/quiz" className="text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + (isAnswered ? 1 : 0)) / total) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{currentQ + 1} / {total}</span>
      </header>

      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 pb-28 gap-5">
        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-200 px-5 py-6 shadow-sm">
          <p className="text-xs text-gray-400 mb-3">Q{currentQ + 1}</p>
          <p className="text-base font-semibold text-gray-900 leading-relaxed">{question.question}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {(question.options as string[]).map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${optionStyle(idx)}`}
            >
              <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                {optionLabel[idx]}
              </span>
              <span className="text-sm leading-snug">{opt}</span>
              {isAnswered && idx === question.correct_index && (
                <span className="ml-auto text-emerald-500 shrink-0">✓</span>
              )}
              {isAnswered && idx === selectedIndex && idx !== question.correct_index && (
                <span className="ml-auto text-red-400 shrink-0">✕</span>
              )}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {isAnswered && question.explanation && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-600 font-semibold mb-1">해설</p>
            <p className="text-sm text-blue-800 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </main>

      {/* Next button */}
      {isAnswered && (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-30">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-transform shadow-lg"
            >
              {isLast ? "결과 보기" : "다음 문제"}
            </button>
          </div>
        </div>
      )}

      <BottomNav userId={userId} />
    </div>
  );
}
