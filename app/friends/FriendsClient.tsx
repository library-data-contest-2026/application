"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

type FriendProfile = { id: string; username: string };

type ReceivedRequest = {
  id: string;
  requester_id: string;
  profiles: FriendProfile | null;
};

type FriendRow = {
  id: string;
  requester_id: string;
  addressee_id: string;
  profiles: FriendProfile | null;
  profiles2: FriendProfile | null;
};

type Props = {
  currentUserId: string;
  received: ReceivedRequest[];
  friends: FriendRow[];
};

export default function FriendsClient({ currentUserId, received: initialReceived, friends: initialFriends }: Props) {
  const [received, setReceived] = useState(initialReceived);
  const [friends, setFriends] = useState(initialFriends);

  async function handleAccept(id: string, requesterId: string, requesterProfile: FriendProfile | null) {
    const supabase = createClient();
    await supabase.from("friendships").update({ status: "accepted" }).eq("id", id);
    setReceived((prev) => prev.filter((r) => r.id !== id));
    setFriends((prev) => [
      ...prev,
      { id, requester_id: requesterId, addressee_id: currentUserId, profiles: requesterProfile, profiles2: null },
    ]);
  }

  async function handleDecline(id: string) {
    const supabase = createClient();
    await supabase.from("friendships").delete().eq("id", id);
    setReceived((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleRemove(id: string) {
    const supabase = createClient();
    await supabase.from("friendships").delete().eq("id", id);
    setFriends((prev) => prev.filter((f) => f.id !== id));
  }

  function getFriendProfile(row: FriendRow): FriendProfile | null {
    if (row.requester_id === currentUserId) {
      return row.profiles2;
    }
    return row.profiles;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 max-w-lg mx-auto">
        <Link href="/" className="text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="font-semibold text-base">친구</h2>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-6">
        {/* 받은 요청 */}
        {received.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">받은 친구 요청 {received.length}</h3>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {received.map((req) => (
                <div key={req.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                    {req.profiles?.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <Link href={`/profile/${req.requester_id}`} className="flex-1 text-sm font-semibold text-gray-900 hover:underline">
                    {req.profiles?.username ?? "알 수 없음"}
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(req.id, req.requester_id, req.profiles)}
                      className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200"
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 친구 목록 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">친구 {friends.length}</h3>
          {friends.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 py-10 text-center">
              <p className="text-sm text-gray-400">아직 친구가 없어요.</p>
              <p className="text-xs text-gray-300 mt-1">다른 유저의 프로필에서 친구를 추가해보세요.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {friends.map((f) => {
                const fp = getFriendProfile(f);
                const friendId = f.requester_id === currentUserId ? f.addressee_id : f.requester_id;
                return (
                  <div key={f.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                      {fp?.username?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <Link href={`/profile/${friendId}`} className="flex-1 text-sm font-semibold text-gray-900 hover:underline">
                      {fp?.username ?? "알 수 없음"}
                    </Link>
                    <button
                      onClick={() => handleRemove(f.id)}
                      className="text-xs text-gray-400 hover:text-red-400"
                    >
                      삭제
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
