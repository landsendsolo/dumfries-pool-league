export const metadata = {
  title: "Documents | Dumfries Pool League",
};

const documents = [
  {
    title: "Official Blackball Rules",
    description:
      "The official EBA Blackball rules used in all Dumfries Pool League matches",
    file: "/blackball-rules.pdf",
    label: "Download PDF",
  },
];

export default function DocumentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Documents & Downloads</h1>
        <p className="text-gray-400 text-sm mt-1">
          Official rules and resources for the Dumfries Pool League
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.title}
            className="bg-navy-light/50 border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors flex flex-col gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{doc.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{doc.description}</p>
              </div>
            </div>
            <a
              href={doc.file}
              download
              className="mt-auto inline-flex items-center justify-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/50 text-gold text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {doc.label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
