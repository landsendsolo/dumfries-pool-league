import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dumfries Pool League",
  description:
    "Official website of the Dumfries Pool League — fixtures, results, league table, and player stats.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/table", label: "Table" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/players", label: "Players" },
  { href: "/venues", label: "Venues" },
  { href: "/cup", label: "Cup" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Header */}
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

              {/* Navigation */}
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
              <MobileMenuButton />
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-navy-dark border-t border-gold/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Dumfries Pool League. Data
              provided by LeagueAppLive.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Proudly sponsored by{" "}
              <span className="text-gold">MKM Dumfries Timber</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

function MobileMenuButton() {
  return (
    <label
      htmlFor="mobile-menu-toggle"
      className="md:hidden cursor-pointer text-gray-300 hover:text-gold p-2"
      aria-label="Toggle menu"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </label>
  );
}

function MobileNav() {
  return (
    <>
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
      <nav className="md:hidden hidden peer-checked:block bg-navy-dark border-t border-gold/10 pb-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
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
    </>
  );
}
