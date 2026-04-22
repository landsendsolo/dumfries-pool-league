import Image from "next/image";

interface Article {
  id: string;
  headline: string;
  date: string;
  excerpt: string;
  imageAspect: "square" | "video";
  image: string;
  imageAlt: string;
  body: string[];
  hashtags: string[];
  sponsor: string;
}

export const metadata = {
  title: "News | Dumfries Pool League",
};

const articles: Article[] = [
  {
    id: "under16-competition-2026",
    headline: "Dumfries Pool League Under 16 Competition",
    date: "22nd April 2026",
    excerpt: "What a brilliant day of pool! We hosted the Dumfries Pool League Under 16 Competition and it was fantastic to see such a great turnout.",
    imageAspect: "square",
    image: "/images/news/under16-winners-2026.jpg",
    imageAlt: "Under 16 Competition winners with trophy",
    body: [
      "What a brilliant day of pool!",
      "Today we hosted the Dumfries Pool League Under 16 Competition, and it was fantastic to see such a great turnout. The standard of play was excellent throughout, with all the lads enjoying themselves and putting on some top-quality performances.",
      "A huge congratulations to our winner, Reily — outstanding pool all day and a fully deserved victory!",
      "A big thank you as well to our hosts Abbey Inn Lincluden for putting on a great venue for the event.",
      "We\u2019re already looking forward to the next one\u2026 and it won\u2019t be long before one of these young players is lifting silverware in the Dumfries Pool League.",
    ],
    hashtags: ["under16", "youth", "pool", "dumfries"],
    sponsor: "",
  },
  {
    id: "mvp-paul-harkness",
    headline: "N’Dulge MVP Award — Paul Harkness Leads the Race",
    date: "30th March 2026",
    excerpt: "This season sees the introduction of a brand new award — the Most Valuable Player (MVP). With 4 rounds remaining, Paul Harkness sits top with an impressive 85% win rate.",
    imageAspect: "square",
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
  {
    id: "abbey-team-champions",
    headline: "Abbey A Win Team Competition — Unbeaten Season Continues",
    date: "28th March 2026",
    excerpt: "Abbey A are crowned Team Competition Champions 2026, beating Lochside Tavern 4-2 in the Final at the Normandy Bar — and they remain unbeaten all season.",
    imageAspect: "square",
    image: "/images/news/abbey-team-champions.png",
    imageAlt: "Abbey A with the Team Competition trophy at the Normandy Bar",
    body: [
      "Team Competition Sponsored by The Normandy Bar.",
      "Semi Final results: Abbey A 4-1 Abbey B. Lochside Tavern 3-3 Normandy A (Lochside Tavern win on penalties).",
      "Final: Abbey A 4-2 Lochside Tavern.",
      "Congratulations to Abbey A on winning the Team Competition and continuing their unbeaten season. A fantastic achievement from a brilliant team.",
    ],
    hashtags: ["TeamCompetition", "AbbeyA", "Champions2026", "UnbeatenSeason"],
    sponsor: "Normandy Bar",
  },
  {
    id: "super11s-champions",
    headline: "Team Dumfries — SPA David Duncan Super 11s Premier Division Champions 2026",
    date: "8th March 2026",
    excerpt: "Ladies and gentlemen, your 2026 David Duncan SPA Super 11 Premier Division Champions — Team Dumfries. A huge congratulations to the South of Scotland team who found a new gear on knockout Sunday.",
    imageAspect: "video",
    image: "/images/news/super11s-champions.jpg",
    imageAlt: "Team Dumfries with the SPA David Duncan Super 11s Premier Division trophy",
    body: [
      "Ladies and gentlemen, your 2026 David Duncan SPA Super 11 Premier Division Champions, Team Dumfries.",
      "A huge congratulations to the South of Scotland team who appeared to find a new gear on knockout Sunday.",
      "A special team, presented their medals and trophy from the family of our late Secretary David Duncan. It was an honour to meet you all.",
      "Well played also to Midlothian A, newly promoted to the Premier Event gave it a go, however came up short in the final.",
      "A superb advert for SPA pool.",
    ],
    hashtags: ["Super11s", "TeamDumfries", "Champions2026", "DavidDuncanTrophy", "SPA"],
    sponsor: "SPA",
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

function ArticleCard({ article }: { article: Article }) {
  return (
    <details className="group bg-navy-light/50 border border-gold/10 rounded-xl overflow-hidden hover:border-gold/30 transition-colors">
      <summary className="cursor-pointer list-none">
        <div className={`relative w-full ${article.imageAspect === "video" ? "aspect-video" : "aspect-square"} overflow-hidden bg-navy-dark`}>
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            className="object-cover transition-opacity"
          />
        </div>
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
      <div className="px-5 pb-6 border-t border-gold/10 pt-4">
        <div className="space-y-3">
          {article.body.map((para, i) => (
            <p key={i} className="text-gray-300 text-sm leading-relaxed">
              {para}
            </p>
          ))}
        </div>
        {article.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {article.hashtags.map((tag) => (
              <span key={tag} className="text-[10px] text-gold/60 bg-gold/5 border border-gold/10 rounded-full px-2 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
