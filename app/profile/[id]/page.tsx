import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: trophies },
    { count: friendCount },
    { data: friendship },
  ] = await Promise.all([
    supabase.from("profiles").select("id, username, bio, avatar_url").eq("id", id).single(),
    supabase.from("user_trophies").select("trophy_id, earned_at, trophies(id, name, icon, rarity)").eq("user_id", id),
    supabase.from("friendships").select("*", { count: "exact", head: true })
      .or(`requester_id.eq.${id},addressee_id.eq.${id}`)
      .eq("status", "accepted"),
    user
      ? supabase.from("friendships").select("status")
          .or(`and(requester_id.eq.${user.id},addressee_id.eq.${id}),and(requester_id.eq.${id},addressee_id.eq.${user.id})`)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!profile) notFound();

  const isOwner = user?.id === id;
  const friendshipStatus = (friendship?.status as "pending" | "accepted" | null) ?? "none";

  return (
    <ProfilePageClient
      profile={profile}
      trophies={(trophies ?? []) as any}
      friendCount={friendCount ?? 0}
      isOwner={isOwner}
      currentUserId={user?.id ?? null}
      friendshipStatus={friendshipStatus}
    />
  );
}
