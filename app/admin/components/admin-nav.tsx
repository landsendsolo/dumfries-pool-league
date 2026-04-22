"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_PAGES = [
  { href: "/admin/im-draw", label: "SPA Events" },
    { href: "/admin/singles", label: "Singles Draw" },
  { href: "/admin/ticker", label: "Ticker Settings" },
  { href: "/admin/feedback", label: "Feedback" },
];

export function AdminNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/feedback");
        if (!res.ok) return;
        const data = await res.json();
        const count = (data.submissions || []).filter(
          (s: { read: boolean }) => !s.read,
        ).length;
        setUnreadCount(count);
      } catch {
        /* skip */
      }
    }
    fetchUnread();
  }, []);

  return (
    <nav className="flex items-center gap-4 mb-6 border-b border-gold/10 pb-4">
      {ADMIN_PAGES.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className={`text-sm font-medium transition-colors relative ${
            pathname === page.href
              ? "text-gold"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {page.label}
          {page.href === "/admin/feedback" && unreadCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold bg-[#e24b4a] text-white rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
