import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: { user } },
    { data: category },
    { data: categoryPosts },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("categories").select("*").eq("id", id).single(),
    supabase.from("posts").select("*, categories(*)").eq("category_id", id).order("created_at", { ascending: false }),
  ]);

  if (!category) notFound();

  return <CategoryPageClient category={category} categoryPosts={categoryPosts ?? []} user={user} />;
}
