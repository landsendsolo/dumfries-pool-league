export const metadata = {
  title: "Sponsors | Dumfries Pool League",
};

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

export default function SponsorsPage() {
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
        <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
          Interested in sponsoring the Dumfries Pool League? Get in touch to
          find out about our sponsorship opportunities and help support pool in
          Dumfries.
        </p>
        <a
          href="mailto:dumfriespoolleague@gmail.com"
          className="inline-flex items-center gap-2 mt-4 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/50 text-gold text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          dumfriespoolleague@gmail.com
        </a>
      </div>
    </div>
  );
}
