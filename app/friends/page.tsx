import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import FriendsClient from "./FriendsClient";

export default async function FriendsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: received }, { data: friends }] = await Promise.all([
    supabase
      .from("friendships")
      .select("id, requester_id, profiles!friendships_requester_id_fkey(id, username)")
      .eq("addressee_id", user.id)
      .eq("status", "pending"),
    supabase
      .from("friendships")
      .select("id, requester_id, addressee_id, profiles!friendships_requester_id_fkey(id, username), profiles!friendships_addressee_id_fkey(id, username)")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq("status", "accepted"),
  ]);

  return (
    <FriendsClient
      currentUserId={user.id}
      received={(received ?? []) as any}
      friends={(friends ?? []) as any}
    />
  );
}
