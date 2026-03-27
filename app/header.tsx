"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem =
  | { type: "link"; href: string; label: string }
  | { type: "dropdown"; key: string; label: string; items: { href: string; label: string }[] };

const navItems: NavItem[] = [
  { type: "link", href: "/", label: "Home" },
  {
    type: "dropdown",
    key: "league",
    label: "League",
    items: [
      { href: "/table", label: "Table" },
      { href: "/fixtures", label: "Fixtures" },
      { href: "/results", label: "Results" },
      { href: "/venues", label: "Venues" },
    ],
  },
  { type: "link", href: "/players", label: "Players" },
  {
    type: "dropdown",
    key: "competitions",
    label: "Competitions",
    items: [
      { href: "/competitions", label: "All Competitions" },
      { href: "/cup", label: "League Competitions" },
      { href: "/spa-events", label: "SPA Events" },
    ],
  },
  {
    type: "dropdown",
    key: "info",
    label: "Info",
    items: [
      { href: "/documents", label: "Documents" },
    ],
  },
  { type: "link", href: "/sponsors", label: "Sponsors" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Close mobile menu and dropdowns when clicking outside
  useEffect(() => {
    if (!menuOpen && !openDropdown) return;

    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuOpen, openDropdown]);

  function handleMouseEnter(key: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  function handleDropdownClick(key: string) {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  function closeAll() {
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  return (
    <header className="sticky top-0 z-50 bg-navy-dark/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeAll}>
            <Image
              src="/logo.png"
              alt="Dumfries Pool League"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-gold font-bold text-lg hidden sm:block">
              Dumfries Pool League
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.type === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeAll}
                    className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-gold transition-colors rounded"
                  >
                    {item.label}
                  </Link>
                );
              }

              // Dropdown
              const isOpen = openDropdown === item.key;
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleDropdownClick(item.key)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-gold transition-colors rounded cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    {item.label}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-navy-dark border border-gold/30 rounded-lg shadow-xl overflow-hidden">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={closeAll}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-gold hover:bg-navy-light/50 transition-colors whitespace-nowrap"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Join CTA */}
            <Link
              href="/join"
              onClick={closeAll}
              className="ml-2 px-4 py-1.5 text-sm font-bold bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors"
            >
              Join
            </Link>
          </nav>

          {/* Sponsor Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-navy-light/60 border border-gold/30 rounded px-3 py-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              Sponsor
            </span>
            <span className="text-gold font-semibold text-sm">
              MKM Dumfries Timber
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            ref={buttonRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden cursor-pointer text-gray-300 hover:text-gold p-2"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-navy-dark border-t border-gold/10 pb-4">
          {navItems.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAll}
                  className="block px-6 py-3 text-sm font-medium text-gray-300 hover:text-gold hover:bg-navy-light/50 transition-colors"
                >
                  {item.label}
                </Link>
              );
            }

            // Mobile dropdown section — always expanded, labelled
            return (
              <div key={item.key}>
                <p className="px-6 pt-4 pb-1 text-[10px] font-semibold text-gold uppercase tracking-widest">
                  {item.label}
                </p>
                {item.items.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={closeAll}
                    className="block px-8 py-2.5 text-sm text-gray-400 hover:text-gold hover:bg-navy-light/50 transition-colors"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            );
          })}

          {/* Mobile Join CTA */}
          <Link
            href="/join"
            onClick={closeAll}
            className="block mx-6 mt-4 py-2.5 text-sm font-bold bg-gold text-navy rounded-lg text-center hover:bg-gold/90 transition-colors"
          >
            Join the League
          </Link>

          <div className="px-6 py-3 mt-2 border-t border-gold/10">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              Sponsor
            </span>
            <span className="text-gold font-semibold text-sm">
              MKM Dumfries Timber
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
