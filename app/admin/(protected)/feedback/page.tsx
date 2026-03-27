"use client";

import { useState, useEffect, useCallback } from "react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/app/admin/components/admin-nav";

interface FeedbackEntry {
  id: string;
  type: string;
  rating: number;
  message: string;
  name: string;
  read: boolean;
  timestamp: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  suggestion: { label: "Suggestion", color: "bg-gold/20 text-gold border-gold/30" },
  bug: { label: "Bug Report", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  general: { label: "General", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  "live-scores": { label: "Live Scores", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "suggestion", label: "Suggestions" },
  { value: "bug", label: "Bug Reports" },
  { value: "general", label: "General" },
  { value: "live-scores", label: "Live Scores" },
];

function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function Stars({ rating }: { rating: number }) {
  if (!rating) return null;
  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? "text-gold" : "text-gray-700"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function FeedbackAdminPage() {
  const [submissions, setSubmissions] = useState<FeedbackEntry[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch("/api/feedback");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      /* skip */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  async function handleAction(action: string, id?: string) {
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch {
      /* skip */
    }
  }

  const filtered = submissions
    .filter((s) => {
      if (filter === "all") return true;
      if (filter === "unread") return !s.read;
      return s.type === filter;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalCount = submissions.length;
  const unreadCount = submissions.filter((s) => !s.read).length;
  const bugCount = submissions.filter((s) => s.type === "bug").length;
  const avgRating =
    submissions.filter((s) => s.rating > 0).length > 0
      ? (
          submissions.filter((s) => s.rating > 0).reduce((sum, s) => sum + s.rating, 0) /
          submissions.filter((s) => s.rating > 0).length
        ).toFixed(1)
      : "—";

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Feedback</h1>
          <p className="text-gray-400 text-sm mt-1">
            View submissions from site visitors
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{totalCount}</p>
          <p className="text-xs text-gray-500 mt-1">Total</p>
        </div>
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gold">{avgRating}</p>
          <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
        </div>
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gold">{unreadCount}</p>
          <p className="text-xs text-gray-500 mt-1">Unread</p>
        </div>
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{bugCount}</p>
          <p className="text-xs text-gray-500 mt-1">Bugs</p>
        </div>
      </div>

      {/* Filter tabs + Mark all read */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                filter === f.value
                  ? "bg-gold text-navy"
                  : "bg-navy-dark border border-gold/20 text-gray-400 hover:text-gray-300"
              }`}
            >
              {f.label}
              {f.value === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-gold/20 text-gold text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => handleAction("markAllRead")}
            className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Feedback list */}
      {filtered.length === 0 ? (
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">
            {totalCount === 0
              ? "No feedback yet."
              : "No feedback matches this filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.general;
            return (
              <div
                key={entry.id}
                className={`bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-5 ${
                  !entry.read ? "border-l-2 border-l-gold" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <Stars rating={entry.rating} />
                    <span className="text-xs text-gray-600">
                      {relativeTime(entry.timestamp)}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!entry.read && (
                      <button
                        type="button"
                        onClick={() => handleAction("markRead", entry.id)}
                        className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleAction("delete", entry.id)}
                      className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2 break-words">
                  {entry.message}
                </p>
                <p className="text-xs text-gray-600">
                  {entry.name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
