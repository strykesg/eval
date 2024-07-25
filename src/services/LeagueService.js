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
        this.apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3001/api';
        this.apiBaseUrl = `${this.apiUrl}/v1`;
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
                    leaderboard[homeTeam] = { teamName: homeTeam, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0, points: 0, headToHead: {} };
                }
                if (!leaderboard[awayTeam]) {
                    leaderboard[awayTeam] = { teamName: awayTeam, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0, points: 0, headToHead: {} };
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
                    this.updateHeadToHead(leaderboard, homeTeam, awayTeam, 3, 0);
                } else if (awayScore > homeScore) {
                    leaderboard[awayTeam].points += 3;
                    this.updateHeadToHead(leaderboard, homeTeam, awayTeam, 0, 3);
                } else {
                    leaderboard[homeTeam].points += 1;
                    leaderboard[awayTeam].points += 1;
                    this.updateHeadToHead(leaderboard, homeTeam, awayTeam, 1, 1);
                }
            }
        });
    
        // Convert to array and sort
        let sortedLeaderboard = Object.values(leaderboard).sort((a, b) => this.sortLeaderboard(a, b));
    
        return sortedLeaderboard;
    }

    updateHeadToHead(leaderboard, homeTeam, awayTeam, homePoints, awayPoints) {
        if (!leaderboard[homeTeam].headToHead[awayTeam]) {
            leaderboard[homeTeam].headToHead[awayTeam] = { points: 0, goalsFor: 0, goalsAgainst: 0 };
        }
        if (!leaderboard[awayTeam].headToHead[homeTeam]) {
            leaderboard[awayTeam].headToHead[homeTeam] = { points: 0, goalsFor: 0, goalsAgainst: 0 };
        }
        leaderboard[homeTeam].headToHead[awayTeam].points += homePoints;
        leaderboard[awayTeam].headToHead[homeTeam].points += awayPoints;
    }
    
    sortLeaderboard(a, b) {
        // Primary sort by points
        if (b.points !== a.points) return b.points - a.points;
    
        // Secondary sort by head-to-head points
        const headToHeadPoints = this.compareHeadToHead(a, b);
        if (headToHeadPoints !== 0) return headToHeadPoints;
    
        // Tertiary sort by goal difference
        const goalDifferenceA = a.goalsFor - a.goalsAgainst;
        const goalDifferenceB = b.goalsFor - b.goalsAgainst;
        if (goalDifferenceB !== goalDifferenceA) return goalDifferenceB - goalDifferenceA;
    
        // Quaternary sort by goals for
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    
        // Final sort by team name
        return a.teamName.localeCompare(b.teamName);
    }
    
    compareHeadToHead(a, b) {
        const aPointsAgainstB = a.headToHead[b.teamName] ? a.headToHead[b.teamName].points : 0;
        const bPointsAgainstA = b.headToHead[a.teamName] ? b.headToHead[a.teamName].points : 0;
        return bPointsAgainstA - aPointsAgainstB;
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