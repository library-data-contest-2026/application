"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import BottomNav from "@/components/BottomNav";

type Trophy = {
  trophy_id: string;
  earned_at: string;
  trophies: { id: string; name: string; icon: string; rarity: string } | null;
};

type Profile = {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
};

type Props = {
  profile: Profile;
  trophies: Trophy[];
  friendCount: number;
  isOwner: boolean;
  currentUserId: string | null;
  friendshipStatus: "none" | "pending" | "accepted" | null;
};

const rarityColor: Record<string, string> = {
  common: "bg-gray-100 border-gray-200",
  rare: "bg-blue-50 border-blue-200",
  epic: "bg-purple-50 border-purple-200",
  legendary: "bg-yellow-50 border-yellow-300",
};

export default function ProfilePageClient({ profile, trophies, friendCount, isOwner, currentUserId, friendshipStatus }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reqStatus, setReqStatus] = useState(friendshipStatus);

  async function handleSave() {
    if (!username.trim()) return;
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ username: username.trim(), bio: bio.trim() || null })
      .eq("id", profile.id);

    if (error) {
      setError("사용자 이름이 이미 사용 중입니다.");
      setSaving(false);
      return;
    }

    setEditing(false);
    setSaving(false);
    router.refresh();
  }

  async function handleAddFriend() {
    if (!currentUserId) return;
    const supabase = createClient();
    await supabase.from("friendships").insert({
      requester_id: currentUserId,
      addressee_id: profile.id,
    });
    setReqStatus("pending");
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const avatarLetter = (username[0] ?? "?").toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 max-w-lg mx-auto">
        <Link href="/" className="text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="font-semibold text-base flex-1">{profile.username}</h2>
        {isOwner && (
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-700">
            로그아웃
          </button>
        )}
      </header>

      <main className="max-w-lg mx-auto">
        {/* Profile info */}
        <div className="bg-white px-6 py-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                avatarLetter
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-center">
              <div>
                <p className="font-bold text-sm">{trophies.length}</p>
                <p className="text-xs text-gray-500">트로피</p>
              </div>
              {isOwner ? (
                <Link href="/friends" className="text-center hover:opacity-70">
                  <p className="font-bold text-sm">{friendCount}</p>
                  <p className="text-xs text-gray-500">친구</p>
                </Link>
              ) : (
                <div className="text-center">
                  <p className="font-bold text-sm">{friendCount}</p>
                  <p className="text-xs text-gray-500">친구</p>
                </div>
              )}
            </div>
          </div>

          {/* Username & Bio */}
          {editing ? (
            <div className="mt-4 flex flex-col gap-2">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
                placeholder="사용자 이름"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={100}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 resize-none"
                placeholder="자기소개 (선택)"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
                <button
                  onClick={() => { setEditing(false); setUsername(profile.username); setBio(profile.bio ?? ""); }}
                  className="flex-1 py-2 border border-gray-200 text-sm font-semibold rounded-lg"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <p className="font-semibold text-sm">{profile.username}</p>
              {profile.bio && <p className="text-sm text-gray-600 mt-0.5">{profile.bio}</p>}
              {isOwner && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-3 w-full py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  프로필 편집
                </button>
              )}
              {!isOwner && currentUserId && (
                <button
                  onClick={handleAddFriend}
                  disabled={reqStatus === "pending" || reqStatus === "accepted"}
                  className="mt-3 w-full py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {reqStatus === "accepted" ? "✓ 친구" : reqStatus === "pending" ? "요청 전송됨" : "친구 추가"}
                </button>
              )}
              {!isOwner && !currentUserId && (
                <Link href="/login" className="mt-3 w-full py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 block text-center">
                  친구 추가
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Trophies */}
        <div className="bg-white border-t border-gray-100 mt-2 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">🏆 트로피</h3>
          {trophies.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">
              아직 획득한 트로피가 없어요.{" "}
              {isOwner && "퀴즈를 풀어서 트로피를 모아보세요!"}
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {trophies.map((t) => {
                const trophy = t.trophies;
                if (!trophy) return null;
                return (
                  <div
                    key={t.trophy_id}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${rarityColor[trophy.rarity] ?? rarityColor.common}`}
                  >
                    <span className="text-2xl">{trophy.icon}</span>
                    <span className="text-[10px] text-gray-600 text-center leading-tight">{trophy.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <div className="h-20" />
      <BottomNav userId={currentUserId} />
    </div>
  );
}
