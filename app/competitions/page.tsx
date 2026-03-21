import {
  COMPETITIONS,
  getTableByCompetition,
  getResultsByCompetition,
} from "@/lib/leagueapp";
import type { TeamStanding, Result } from "@/lib/leagueapp";
import { CompetitionTabs } from "./competition-tabs";

export const metadata = {
  title: "Competitions | Dumfries Pool League",
};

interface SoSGroup {
  label: string;
  standings: TeamStanding[];
  results: Result[];
}

interface CompetitionSection {
  id: string;
  label: string;
  standings: TeamStanding[];
  results: Result[];
}

export default async function CompetitionsPage() {
  const [
    sosATable,
    sosBTable,
    sosCTable,
    sosDTable,
    sosAResults,
    sosBResults,
    sosCResults,
    sosDResults,
    tcTable,
    tcWk2Table,
    tcResults,
    tcWk2Results,
    friendlyTable,
    friendlyResults,
  ] = await Promise.all([
    getTableByCompetition(COMPETITIONS.SOS_GROUP_A),
    getTableByCompetition(COMPETITIONS.SOS_GROUP_B),
    getTableByCompetition(COMPETITIONS.SOS_GROUP_C),
    getTableByCompetition(COMPETITIONS.SOS_GROUP_D),
    getResultsByCompetition(COMPETITIONS.SOS_GROUP_A),
    getResultsByCompetition(COMPETITIONS.SOS_GROUP_B),
    getResultsByCompetition(COMPETITIONS.SOS_GROUP_C),
    getResultsByCompetition(COMPETITIONS.SOS_GROUP_D),
    getTableByCompetition(COMPETITIONS.TEAM_COMP),
    getTableByCompetition(COMPETITIONS.TEAM_COMP_WK2),
    getResultsByCompetition(COMPETITIONS.TEAM_COMP),
    getResultsByCompetition(COMPETITIONS.TEAM_COMP_WK2),
    getTableByCompetition(COMPETITIONS.FRIENDLY),
    getResultsByCompetition(COMPETITIONS.FRIENDLY),
  ]);

  const sosGroups: SoSGroup[] = [
    { label: "Group A", standings: sosATable, results: sosAResults },
    { label: "Group B", standings: sosBTable, results: sosBResults },
    { label: "Group C", standings: sosCTable, results: sosCResults },
    { label: "Group D", standings: sosDTable, results: sosDResults },
  ];

  const competitions: CompetitionSection[] = [
    { id: "team-comp", label: "Team Competition", standings: tcTable, results: tcResults },
    { id: "team-comp-wk2", label: "Team Competition WK2", standings: tcWk2Table, results: tcWk2Results },
    { id: "friendly", label: "Friendly", standings: friendlyTable, results: friendlyResults },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Competitions</h1>
        <p className="text-gray-400 text-sm mt-1">
          All competitions for the 2025/26 season
        </p>
      </div>

      <CompetitionTabs
        sosGroups={sosGroups}
        competitions={competitions}
      />
    </div>
  );
}
