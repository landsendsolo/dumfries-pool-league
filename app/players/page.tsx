import { getPlayerStats } from "@/lib/leagueapp";
import { PlayerSearch } from "./player-search";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export const metadata = {
  title: "Players | Dumfries Pool League",
};

export default async function PlayersPage() {
  const players = await getPlayerStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Player Stats</h1>
        <p className="text-gray-400 text-sm mt-1">
          Individual player statistics for the current season
        </p>
      </div>

      <PlayerSearch players={players} />
    </div>
  );
}
