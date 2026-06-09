"use client";

import Link from "next/link";
import { Quiz } from "@/types";
import BottomNav from "@/components/BottomNav";

const difficultyLabel: Record<string, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

const difficultyColor: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-600",
};

const difficultyBar: Record<string, string> = {
  easy: "bg-emerald-400",
  medium: "bg-amber-400",
  hard: "bg-red-400",
};

type Props = {
  quizzes: Quiz[];
  userId: string | null;
};

export default function QuizListClient({ quizzes, userId }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 max-w-lg mx-auto">
        <h1 className="font-bold text-base">퀴즈</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {quizzes.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            <p className="text-4xl mb-3">💡</p>
            <p>아직 퀴즈가 없어요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden flex hover:shadow-sm transition-shadow active:scale-[0.99]"
              >
                <div className={`w-1.5 shrink-0 ${difficultyBar[quiz.difficulty] ?? "bg-gray-300"}`} />
                <div className="flex-1 px-4 py-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">{quiz.categories?.name ?? "기타"}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyColor[quiz.difficulty] ?? "bg-gray-100 text-gray-500"}`}>
                        {difficultyLabel[quiz.difficulty] ?? quiz.difficulty}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-gray-900 leading-snug">{quiz.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{quiz.quiz_questions.length}문제</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <div className="h-20" />
      <BottomNav userId={userId} />
    </div>
  );
}
