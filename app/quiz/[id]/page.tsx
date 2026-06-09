import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import QuizPlayClient from "./QuizPlayClient";
import { Quiz } from "@/types";

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: quiz }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("quizzes")
      .select("*, categories(id, name, avatar), quiz_questions(id, question, options, correct_index, explanation, order_index)")
      .eq("id", id)
      .single(),
  ]);

  if (!quiz) notFound();

  const sorted = {
    ...quiz,
    quiz_questions: [...(quiz.quiz_questions ?? [])].sort((a, b) => a.order_index - b.order_index),
  } as unknown as Quiz;

  return <QuizPlayClient quiz={sorted} userId={user?.id ?? null} />;
}
