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
    getLeaderboard() {}
    
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
            console.error('Error fetching data:', error);
        }
    }    
}

export default LeagueService;