"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import BottomNav from "@/components/BottomNav";

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

type SentRequest = {
  id: string;
  addressee_id: string;
};

type SearchResult = {
  id: string;
  username: string;
};

type Props = {
  currentUserId: string;
  received: ReceivedRequest[];
  friends: FriendRow[];
  sent: SentRequest[];
};

export default function FriendsClient({ currentUserId, received: initialReceived, friends: initialFriends, sent: initialSent }: Props) {
  const [received, setReceived] = useState(initialReceived);
  const [friends, setFriends] = useState(initialFriends);
  const [sent, setSent] = useState(initialSent);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setSearchResults([]); return; }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id, username")
        .ilike("username", `%${q}%`)
        .neq("id", currentUserId)
        .limit(10);
      setSearchResults((data as SearchResult[]) ?? []);
      setSearching(false);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, currentUserId]);

  function getFriendStatus(userId: string): "accepted" | "sent" | "received" | "none" {
    if (friends.some((f) => f.requester_id === userId || f.addressee_id === userId)) return "accepted";
    if (sent.some((s) => s.addressee_id === userId)) return "sent";
    if (received.some((r) => r.requester_id === userId)) return "received";
    return "none";
  }

  async function handleSendRequest(addresseeId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("friendships")
      .insert({ requester_id: currentUserId, addressee_id: addresseeId })
      .select("id, addressee_id")
      .single();
    if (data) setSent((prev) => [...prev, data]);
  }

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
        <Link href={`/profile/${currentUserId}`} className="text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="font-semibold text-base">친구</h2>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-6">
        {/* 검색 */}
        <section>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="사용자 이름으로 검색"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setSearchResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {query.trim() && (
            <div className="mt-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {searching ? (
                <p className="text-sm text-gray-400 text-center py-4">검색 중...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">검색 결과가 없어요.</p>
              ) : (
                searchResults.map((result) => {
                  const status = getFriendStatus(result.id);
                  return (
                    <div key={result.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0">
                      <Link href={`/profile/${result.id}`} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 hover:opacity-80">
                        {result.username[0].toUpperCase()}
                      </Link>
                      <Link href={`/profile/${result.id}`} className="flex-1 text-sm font-semibold text-gray-900 hover:underline">
                        {result.username}
                      </Link>
                      {status === "accepted" && (
                        <span className="text-xs text-gray-400 font-medium">친구</span>
                      )}
                      {status === "sent" && (
                        <span className="text-xs text-gray-400 font-medium">요청 전송됨</span>
                      )}
                      {status === "received" && (
                        <span className="text-xs text-blue-500 font-medium">요청 받음</span>
                      )}
                      {status === "none" && (
                        <button
                          onClick={() => handleSendRequest(result.id)}
                          className="text-xs font-semibold px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          친구 추가
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
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

      <div className="h-20" />
      <BottomNav userId={currentUserId} />
    </div>
  );
}
