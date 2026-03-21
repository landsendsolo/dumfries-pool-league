import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./header";

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
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

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
        <Header />

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
