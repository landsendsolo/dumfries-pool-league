"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_PAGES = [
  { href: "/admin/im-draw", label: "SPA Events" },
  { href: "/admin/ticker", label: "Ticker Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 mb-6 border-b border-gold/10 pb-4">
      {ADMIN_PAGES.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className={`text-sm font-medium transition-colors ${
            pathname === page.href
              ? "text-gold"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
}
