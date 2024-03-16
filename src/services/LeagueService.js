/**
 * A class representing a service that processes the data for match schedule
 * and generates leaderboard.
 * 
 * NOTE: MAKE SURE TO IMPLEMENT ALL EXISITNG METHODS BELOW WITHOUT CHANGING THE INTERFACE OF THEM, 
 *       AND PLEASE DO NOT RENAME, MOVE OR DELETE THIS FILE.  
 * 
 *       ADDITIONALLY, MAKE SURE THAT ALL LIBRARIES USED IN THIS FILE FILE ARE COMPATIBLE WITH PURE JAVASCRIPT
 * 
 */
class LeagueService {    
    constructor() {
        this.matches = [];
        this.apiVersion = null;
        this.apiUrl = 'http://localhost:3001/api';
        this.apiBaseUrl = 'http://localhost:3001/api/v1';
    }
    /**
     * Sets the match schedule.
     * Match schedule will be given in the following form:
     * [
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      },
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      }    
     * ]
     * 
     * @param {Array} matches List of matches.
     */    
    setMatches(matches) {
        this.matches = matches;
    }

    /**
     * Returns the full list of matches.
     * 
     * @returns {Array} List of matches.
     */
    getMatches() {
        return this.matches;
    }

    /**
     * Returns the leaderboard in a form of a list of JSON objecs.
     * 
     * [     
     *      {
     *          teamName: [STRING]',
     *          matchesPlayed: [INTEGER],
     *          goalsFor: [INTEGER],
     *          goalsAgainst: [INTEGER],
     *          points: [INTEGER]     
     *      },      
     * ]       
     * 
     * @returns {Array} List of teams representing the leaderboard.
     */
    getLeaderboard() {
        const leaderboard = {};

        // Process each match and calculate points and goals
        this.matches.forEach(match => {
            if (match.matchPlayed) {
                const homeTeam = match.homeTeam;
                const awayTeam = match.awayTeam;
                const homeScore = match.homeTeamScore;
                const awayScore = match.awayTeamScore;

                // Initialize team stats
                if (!leaderboard[homeTeam]) {
                    leaderboard[homeTeam] = { teamName: homeTeam, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
                }
                if (!leaderboard[awayTeam]) {
                    leaderboard[awayTeam] = { teamName: awayTeam, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
                }

                // Update matches played
                leaderboard[homeTeam].matchesPlayed += 1;
                leaderboard[awayTeam].matchesPlayed += 1;

                // Update goals
                leaderboard[homeTeam].goalsFor += homeScore;
                leaderboard[awayTeam].goalsFor += awayScore;

                leaderboard[homeTeam].goalsAgainst += awayScore;
                leaderboard[awayTeam].goalsAgainst += homeScore;

                // Assign points based on match result
                if (homeScore > awayScore) {
                    leaderboard[homeTeam].points += 3;
                } else if (awayScore > homeScore) {
                    leaderboard[awayTeam].points += 3;
                } else {
                    leaderboard[homeTeam].points += 1;
                    leaderboard[awayTeam].points += 1;
                }
            }
        });

        const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => {
            // Sort by points, then goal difference, then goals for
            if (b.points !== a.points) return b.points - a.points;
            const goalDifferenceA = a.goalsFor - a.goalsAgainst;
            const goalDifferenceB = b.goalsFor - b.goalsAgainst;
            if (goalDifferenceB !== goalDifferenceA) return goalDifferenceB - goalDifferenceA;
            return b.goalsFor - a.goalsFor;
        });

        return sortedLeaderboard;
    }
    
    /**
     * Asynchronic function to fetch the data from the server.
     */
    async fetchData() {
        try {
            // Fetch access token
            const accessTokenResponse = await fetch(`${this.apiBaseUrl}/getAccessToken`);
            const accessTokenData = await accessTokenResponse.json();

            if (!accessTokenData.success) {
                throw new Error('Failed to fetch access token');
            }

            const { access_token } = accessTokenData;

            // Fetch matches using the access token
            const matchesResponse = await fetch(`${this.apiBaseUrl}/getAllMatches`, {
                headers: { 
                    Authorization: `Bearer ${access_token}` 
                }
            });

            const matchesData = await matchesResponse.json();

            if (!matchesData.success) {
                throw new Error('Failed to fetch matches');
            }

            // Store the fetched matches
            this.setMatches(matchesData.matches);
        } catch (error) {
            alert('Error fetching data: <br>' + error);
        }
    }    

    setAPIVersion(version){
        this.apiVersion = version;
    }

    getAPIVersion(){
        return this.apiVersion;
    }

    async fetchAPIVersion(){
        try {
            const versionResponse = await fetch(`${this.apiUrl}/version`);
            const versionData = await versionResponse.json();
            if (!versionData.success) {
                throw new Error('Failed to fetch API ., Unsuccessful');
            }
            this.setAPIVersion(versionData.version);

        } catch (error){
            console.log("Failed retrieving API Version",  error);
        }
    }
}

export default LeagueService;