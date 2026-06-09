import { createClient } from "@/lib/supabase-server";
import QuizListClient from "./QuizListClient";
import { Quiz } from "@/types";

export default async function QuizPage() {
  const supabase = await createClient();

  const [{ data: { user } }, { data: quizzes }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("quizzes")
      .select("*, categories(id, name, avatar), quiz_questions(id, question, options, correct_index, explanation, order_index)")
      .order("created_at", { ascending: true }),
  ]);

  return (
    <QuizListClient
      quizzes={(quizzes ?? []) as unknown as Quiz[]}
      userId={user?.id ?? null}
    />
  );
}
