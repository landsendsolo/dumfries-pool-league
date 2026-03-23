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

        {/* Sponsors Strip */}
        <section className="bg-[#0a1220] border-t border-gold/10 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-[10px] text-gold uppercase tracking-widest font-semibold shrink-0">
              Our Sponsors
            </span>
            {[
              "MKM Dumfries Timber",
              "JJ Plumbing & Bathrooms",
              "Abbey Inn",
              "N Dulge",
              "Solway Fitness",
              "JLW Joinery",
              "GH Gardening and Labouring Services",
              "Jayde Devlin Steel Framed Buildings",
            ].map((name) => (
              <span
                key={name}
                className="text-xs text-gray-300 bg-navy-light/60 border border-gold/20 rounded-full px-3 py-0.5 whitespace-nowrap"
              >
                {name}
              </span>
            ))}
            <a
              href="/sponsors"
              className="text-xs text-gold hover:underline shrink-0 ml-1"
            >
              Become a Sponsor →
            </a>
          </div>
        </section>

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
