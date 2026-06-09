import { createClient } from "@/lib/supabase-server";
import Feed from "@/components/Feed";

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: { user } },
    { data: posts },
    { data: categories },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("posts")
      .select("*, categories(*)")
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*"),
  ]);

  return <Feed posts={posts ?? []} categories={categories ?? []} user={user} />;
}
