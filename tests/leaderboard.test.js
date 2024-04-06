/**
 * 
 *  THIS IS A TESTING FILE. YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO TEST YOUR WORK.
 *  PLEASE DON´T CHANGE THE INTERFACE OF leagueService.js METHODS
 *
 */

require('jest-fetch-mock').enableMocks();
fetchMock.dontMock();

import LeagueService from "../src/services/LeagueService";
describe("leagueService", () => {
  let leagueService;

  beforeEach(() => {
    fetch.resetMocks();
    leagueService = new LeagueService();
  });

  test("constructor initializes properties correctly", () => {
    expect(leagueService.matches).toEqual([]);
    expect(leagueService.apiVersion).toBeNull();
    expect(leagueService.apiUrl).toBe("http://localhost:3001/api");
    expect(leagueService.apiBaseUrl).toBe("http://localhost:3001/api/v1");
  });

  test("setMatches and getMatches work correctly", () => {
    const matches = [{ matchDate: "2020-01-01", homeTeam: "Team A", awayTeam: "Team B" }];
    leagueService.setMatches(matches);
    expect(leagueService.getMatches()).toEqual(matches);
  });

  test("setAPIVersion and getAPIVersion work correctly", () => {
    const version = "1.0";
    leagueService.setAPIVersion(version);
    expect(leagueService.getAPIVersion()).toBe(version);
  });

  test("fetchData successfully fetches and stores matches", async () => {
    const mockMatches = [{ matchDate: "2020-01-01", homeTeam: "Team A", awayTeam: "Team B" }];
    fetchMock
      .once(JSON.stringify({ success: true, access_token: "mockToken" })) // First call to fetch access token
      .once(JSON.stringify({ success: true, matches: mockMatches })); // Second call to fetch matches

    await leagueService.fetchData();

    expect(leagueService.getMatches()).toEqual(mockMatches);
  });


  test("fetchAPIVersion successfully fetches and stores API version", async () => {
    const mockVersion = "1.0";
    fetchMock.once(JSON.stringify({ success: true, version: mockVersion }));

    await leagueService.fetchAPIVersion();

    expect(leagueService.getAPIVersion()).toBe(mockVersion);
  });

  test("fetchAPIVersion handles failure in fetching API version", async () => {
    fetchMock.once(JSON.stringify({ success: false }));

    await leagueService.fetchAPIVersion();

    expect(leagueService.getAPIVersion()).toBeNull();
  });


});

describe("leaderboard", () => {
  let leagueService;

  beforeEach(() => {
    fetch.resetMocks();
    leagueService = new LeagueService();
  });



  test('check-leaderboard-teams', async () => {
    const matches = [
      {
        matchDate: Date.now(),
        stadium: 'Maracanã',
        homeTeam: 'Brazil',
        awayTeam: 'France',
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 1
      }
    ];
    leagueService.setMatches(matches);

    const leaderboard = leagueService.getLeaderboard();

    const firstTeam = leaderboard[0];
    expect(firstTeam.teamName).toBe('Brazil');
    expect(firstTeam.matchesPlayed).toBe(1);
    expect(firstTeam.goalsFor).toBe(2);
    expect(firstTeam.goalsAgainst).toBe(1);
    expect(firstTeam.points).toBe(3);

    const secondTeam = leaderboard[1];
    expect(secondTeam.teamName).toBe('France');
    expect(secondTeam.matchesPlayed).toBe(1);
    expect(secondTeam.goalsFor).toBe(1);
    expect(secondTeam.goalsAgainst).toBe(2);
    expect(secondTeam.points).toBe(0);
  });
});

describe("leaderboardGeneration", () => {
  let leagueService;

  beforeEach(() => {
    fetch.resetMocks();
    leagueService = new LeagueService();
  });

  test("points are correctly assigned for wins and draws", () => {
    const matches = [
      { matchDate: "2023-04-01", homeTeam: "Team A", awayTeam: "Team B", matchPlayed: true, homeTeamScore: 2, awayTeamScore: 1 }, // Team A wins
      { matchDate: "2023-04-02", homeTeam: "Team C", awayTeam: "Team D", matchPlayed: true, homeTeamScore: 1, awayTeamScore: 1 }, // Draw
    ];
    leagueService.setMatches(matches);
    const leaderboard = leagueService.getLeaderboard();

    // Team A should have 3 points
    const teamA = leaderboard.find(team => team.teamName === "Team A");
    expect(teamA.points).toBe(3);

    // Team C and Team D should each have 1 point
    const teamC = leaderboard.find(team => team.teamName === "Team C");
    const teamD = leaderboard.find(team => team.teamName === "Team D");
    expect(teamC.points).toBe(1);
    expect(teamD.points).toBe(1);
  });

  test("leaderboard orders teams by points, then by head-to-head points", () => {
    const matches = [
      { matchDate: "2023-04-01", homeTeam: "Team A", awayTeam: "Team B", matchPlayed: true, homeTeamScore: 2, awayTeamScore: 0 }, // Team A wins
      { matchDate: "2023-04-02", homeTeam: "Team A", awayTeam: "Team C", matchPlayed: true, homeTeamScore: 1, awayTeamScore: 1 }, // Draw
      { matchDate: "2023-04-03", homeTeam: "Team B", awayTeam: "Team C", matchPlayed: true, homeTeamScore: 0, awayTeamScore: 3 }, // Team C wins
    ];
    leagueService.setMatches(matches);
    const leaderboard = leagueService.getLeaderboard();

    // Team C should be first due to head-to-head win against Team B
    expect(leaderboard[0].teamName).toBe("Team C");
    expect(leaderboard[1].teamName).toBe("Team A");
    expect(leaderboard[2].teamName).toBe("Team B");
  });

  test("tiebreakers: goal difference, scored goals, and alphabetic order", () => {
    const matches = [
      { matchDate: "2023-04-01", homeTeam: "Team A", awayTeam: "Team B", matchPlayed: true, homeTeamScore: 3, awayTeamScore: 1 }, // Team A wins
      { matchDate: "2023-04-02", homeTeam: "Team C", awayTeam: "Team D", matchPlayed: true, homeTeamScore: 2, awayTeamScore: 2 }, // Draw
      { matchDate: "2023-04-03", homeTeam: "Team E", awayTeam: "Team F", matchPlayed: true, homeTeamScore: 1, awayTeamScore: 1 }, // Draw
    ];
    leagueService.setMatches(matches);
    const leaderboard = leagueService.getLeaderboard();

    // Team A should be first due to highest points
    expect(leaderboard[0].teamName).toBe("Team A");

    // Teams C, D, E, F should have the same points but sorted by goal difference, then goals for, then alphabetically
    expect(leaderboard[1].teamName).toBe("Team C"); // Higher goal difference
    expect(leaderboard[2].teamName).toBe("Team D"); // Same goal difference as C but lower alphabetically
    expect(leaderboard[3].teamName).toBe("Team E"); // Lower goal difference but higher alphabetically than F
    expect(leaderboard[4].teamName).toBe("Team F"); // Same points and goal difference as E but lower alphabetically
  });
});