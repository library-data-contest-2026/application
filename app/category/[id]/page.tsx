import { categories, posts } from "@/lib/mockData";
import { createClient } from "@/lib/supabase-server";
import CategoryPageClient from "./CategoryPageClient";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const category = categories.find((c) => c.id === id);
  const categoryPosts = posts.filter((p) => p.categoryId === id);

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">존재하지 않는 카테고리입니다.</p>
      </div>
    );
  }

  return <CategoryPageClient category={category} categoryPosts={categoryPosts} user={user} />;
}
