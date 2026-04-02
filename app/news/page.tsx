import Image from "next/image";

export const metadata = {
  title: "News | Dumfries Pool League",
};

const articles = [
  {
    id: "mvp-paul-harkness",
    headline: "N’Dulge MVP Award — Paul Harkness Leads the Race",
    date: "30th March 2026",
    excerpt: "This season sees the introduction of a brand new award — the Most Valuable Player (MVP). With 4 rounds remaining, Paul Harkness sits top with an impressive 85% win rate.",
    image: "/images/news/mvp-paul-harkness.jpg",
    imageAlt: "Paul Harkness — MVP leader with 85% win rate, sponsored by N’Dulge",
    body: [
      "This season sees the introduction of a brand new award… the Most Valuable Player (MVP).",
      "The MVP will be awarded to the player with the highest win rate across the season, with a minimum requirement of 75% of fixtures played to qualify. Consistency is key – every frame counts!",
      "Who will earn the bragging rights and be able to call themselves the league’s MVP?",
      "With just 4 rounds of fixtures remaining, it’s Mr Dumfries Pool Paul Harkness who currently sits top of the pile and holds the bragging rights… but can he hold on until the end of the season?",
      "Thank you to N’Dulge for their continued support of the league!",
    ],
    hashtags: ["MVP", "DumfriesPool", "RaceToTheFinish"],
    sponsor: "N’Dulge",
  },
];

export default function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">News</h1>
        <p className="text-gray-400 text-sm mt-1">
          Latest news and announcements from the Dumfries Pool League
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: typeof articles[0] }) {
  return (
    <details className="group bg-navy-light/50 border border-gold/10 rounded-xl overflow-hidden hover:border-gold/30 transition-colors">
      <summary className="cursor-pointer list-none">
        {/* Image */}
        <div className="relative w-full aspect-video overflow-hidden bg-navy-dark">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            className="object-cover transition-opacity"
          />
        </div>

        {/* Card header */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{article.date}</span>
            {article.sponsor && (
              <span className="text-[10px] font-semibold text-gold bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5">
                {article.sponsor}
              </span>
            )}
          </div>
          <h2 className="text-white font-bold text-base leading-snug mb-2 group-open:text-gold transition-colors">
            {article.headline}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed group-open:hidden">
            {article.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-1 text-gold text-xs font-semibold group-open:hidden">
            Read more
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </summary>

      {/* Full article body */}
      <div className="px-5 pb-6 border-t border-gold/10 pt-4">
        <div className="space-y-3">
          {article.body.map((para, i) => (
            <p key={i} className="text-gray-300 text-sm leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Hashtags */}
        {article.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {article.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-gold/60 bg-gold/5 border border-gold/10 rounded-full px-2 py-0.5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
