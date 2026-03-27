"use client";

import { useState, useEffect, useRef } from "react";

const CHIPS = [
  "I'd love to see...",
  "I found an issue with...",
  "Just wanted to say...",
  "The live scores...",
];

const TYPES = [
  { value: "suggestion", label: "Suggestion" },
  { value: "bug", label: "Bug Report" },
  { value: "general", label: "General" },
  { value: "live-scores", label: "Live Scores" },
] as const;

function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (n: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onRate(n)}
          className="text-2xl cursor-pointer transition-colors"
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <span className={n <= rating ? "text-gold" : "text-gray-700"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("suggestion");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setOpen(false);
        resetForm();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function resetForm() {
    setType("suggestion");
    setRating(0);
    setMessage("");
    setName("");
  }

  function handleChip(text: string) {
    setMessage(text);
    textareaRef.current?.focus();
  }

  async function handleSubmit() {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, rating, message, name }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // fail silently
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating tab */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gold text-navy font-bold text-xs tracking-wider px-2.5 py-3 rounded-l-lg cursor-pointer hover:bg-gold-light transition-colors shadow-lg"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Feedback
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => {
            setOpen(false);
            if (!submitted) resetForm();
          }}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-[#0f1a2e] z-50 transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-gold px-4 py-3 flex items-center justify-between shrink-0">
          <h2 className="text-navy font-bold text-sm">Share your feedback</h2>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              if (!submitted) resetForm();
            }}
            className="text-navy text-xl leading-none cursor-pointer hover:opacity-70"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-white font-bold text-lg">
              Thanks for your feedback!
            </p>
            <p className="text-gray-400 text-sm">
              We appreciate you taking the time.
            </p>
          </div>
        ) : (
          /* Form */
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChip(chip)}
                  className="text-xs border border-gold/40 text-gold bg-navy-dark/50 rounded-full px-3 py-1.5 cursor-pointer hover:bg-gold/10 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Type selector */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                      type === t.value
                        ? "bg-gold text-navy"
                        : "bg-navy-dark/50 border border-gold/20 text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Star rating */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Rating (optional)
              </label>
              <StarRating rating={rating} onRate={setRating} />
            </div>

            {/* Textarea */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Feedback <span className="text-red-400">*</span>
              </label>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think about the site..."
                rows={4}
                className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors placeholder:text-gray-600 resize-none"
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors placeholder:text-gray-600"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!message.trim() || submitting}
              className="w-full bg-gold text-navy font-bold text-sm py-3 rounded-lg hover:bg-gold/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
