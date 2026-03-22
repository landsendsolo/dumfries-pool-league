"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/table", label: "Table" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/players", label: "Players" },
  { href: "/competitions", label: "Competitions" },
  { href: "/venues", label: "Venues" },
  { href: "/cup", label: "Cup" },
  { href: "/documents", label: "Documents" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-navy-dark/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-navy font-bold text-sm">DPL</span>
            </div>
            <span className="text-gold font-bold text-lg hidden sm:block">
              Dumfries Pool League
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-gold transition-colors rounded"
              >
                {link.label}
              </Link>
            ))}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-navy-dark border-t border-gold/10 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm font-medium text-gray-300 hover:text-gold hover:bg-navy-light/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
