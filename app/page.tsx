import { posts, categories } from "@/lib/mockData";
import { createClient } from "@/lib/supabase-server";
import Feed from "@/components/Feed";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <Feed posts={posts} categories={categories} user={user} />;
}
