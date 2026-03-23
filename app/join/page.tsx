"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const FORMSPREE_URL = "https://formspree.io/f/REPLACE_JOIN_ID";

const features = [
  {
    title: "League Nights",
    desc: "Every Friday at 7:30pm",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Great Prizes",
    desc: "Trophies and prize money up for grabs",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
  {
    title: "Scottish Champions",
    desc: "Home to SPA Super 11's Scottish Champions",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "All Welcome",
    desc: "New players and teams always welcome",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function JoinPage() {
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
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-dark to-navy py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-xs font-semibold px-3 py-1 rounded-full mb-6">
            SPA Super 11&apos;s Scottish Champions 🏆
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Interested in Playing Pool?
          </h1>
          <p className="text-lg sm:text-xl text-gray-400">
            Join the Dumfries Pool League
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-navy-light/50 border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-navy-light/40 border border-gold/20 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div className="flex justify-between border-b border-navy/30 pb-2">
              <span className="text-gray-400">Team size</span>
              <span className="text-white font-medium">6 players per team</span>
            </div>
            <div className="flex justify-between border-b border-navy/30 pb-2">
              <span className="text-gray-400">Match format</span>
              <span className="text-white font-medium">6 Singles — 2 Doubles — 6 Singles</span>
            </div>
            <div className="flex justify-between border-b border-navy/30 pb-2">
              <span className="text-gray-400">Rules</span>
              <span className="text-white font-medium">Blackball Rules</span>
            </div>
            <div className="flex justify-between border-b border-navy/30 pb-2">
              <span className="text-gray-400">New season</span>
              <span className="text-white font-medium">Starts September</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 pb-12">
        <div className="bg-navy-light/40 border border-gold/20 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-2">Get In Touch</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xl">
            Want to join or find out more? Fill in the form below and we&apos;ll get
            back to you, or contact Peter directly on{" "}
            <a href="tel:07432121634" className="text-gold hover:underline">
              07432 121634
            </a>
          </p>

          {status === "success" ? (
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
              Thanks! We&apos;ll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs text-gray-400 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs text-gray-400 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label htmlFor="joining_as" className="block text-xs text-gray-400 mb-1">
                    Are you joining as
                  </label>
                  <select
                    id="joining_as"
                    name="joining_as"
                    className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="Individual Player">Individual Player</option>
                    <option value="Full Team">Full Team</option>
                    <option value="Just Interested">Just Interested</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs text-gray-400 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  placeholder="Tell us a bit about yourself (optional)"
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
                {status === "submitting" ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Facebook */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="text-center">
          <a
            href="https://www.facebook.com/dumfriespoolleague"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Find us on Facebook
          </a>
        </div>
      </section>
    </div>
  );
}
