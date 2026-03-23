"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const FORMSPREE_URL = "https://formspree.io/f/meerygwn";

const sponsors = [
  {
    name: "MKM Dumfries Timber",
    initials: "MKM",
    role: "Main Sponsor",
    highlight: true,
  },
  {
    name: "JJ Plumbing & Bathrooms",
    initials: "JJ",
    role: "League Rankings Sponsor",
    highlight: false,
  },
  {
    name: "Abbey Inn",
    initials: "AI",
    role: "Official Sponsor",
    highlight: false,
  },
  {
    name: "N Dulge",
    initials: "ND",
    role: "Official Sponsor",
    highlight: false,
  },
  {
    name: "Solway Fitness",
    initials: "SF",
    role: "Official Sponsor",
    highlight: false,
  },
  {
    name: "JLW Joinery",
    initials: "JLW",
    role: "Official Sponsor",
    highlight: false,
  },
  {
    name: "GH Gardening and Labouring Services",
    initials: "GH",
    role: "Official Sponsor",
    highlight: false,
  },
  {
    name: "Jayde Devlin Steel Framed Buildings",
    initials: "JD",
    role: "Official Sponsor",
    highlight: false,
  },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function SponsorsPage() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Our Sponsors</h1>
        <p className="text-gray-400 text-sm mt-1">
          The businesses that make the Dumfries Pool League possible
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.name}
            className={`rounded-xl p-5 flex flex-col gap-3 transition-colors ${
              sponsor.highlight
                ? "bg-gold/10 border border-gold/40 hover:border-gold/70"
                : "bg-navy-light/50 border border-gold/10 hover:border-gold/30"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                sponsor.highlight
                  ? "bg-gold text-navy"
                  : "bg-gold/10 text-gold"
              }`}
            >
              {sponsor.initials}
            </div>

            {/* Name & role */}
            <div>
              <p className="text-gold font-semibold text-sm leading-snug">
                {sponsor.name}
              </p>
              <span
                className={`inline-block mt-1.5 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${
                  sponsor.highlight
                    ? "bg-gold/20 text-gold"
                    : "bg-navy-dark/60 text-gray-400 border border-gold/10"
                }`}
              >
                {sponsor.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Become a Sponsor */}
      <div className="mt-12 bg-navy-light/40 border border-gold/20 rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-2">Become a Sponsor</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-6">
          Interested in sponsoring the Dumfries Pool League? Get in touch to
          find out about our sponsorship opportunities and help support pool in
          Dumfries.
        </p>

        {status === "success" ? (
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
            Thanks for your interest! We&apos;ll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sp_name" className="block text-xs text-gray-400 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="sp_name"
                  name="name"
                  required
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="sp_business" className="block text-xs text-gray-400 mb-1">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="sp_business"
                  name="business"
                  required
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Business name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sp_email" className="block text-xs text-gray-400 mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="sp_email"
                  name="email"
                  required
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="sp_phone" className="block text-xs text-gray-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="sp_phone"
                  name="phone"
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sp_message" className="block text-xs text-gray-400 mb-1">
                Message
              </label>
              <textarea
                id="sp_message"
                name="message"
                rows={4}
                className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                placeholder="Tell us about your sponsorship interest (optional)"
              />
            </div>

            {status === "error" && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full sm:w-auto bg-gold text-navy font-bold text-sm px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {status === "submitting" ? "Sending..." : "Send Sponsorship Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
