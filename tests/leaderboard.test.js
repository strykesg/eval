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

describe("laderboard", () => {
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