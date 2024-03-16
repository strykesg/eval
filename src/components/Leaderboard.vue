<template>
    <div>
      <h1>League Standings</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>Team Name</th>
              <th class="mp">MP</th>
              <th class="gf" v-show="screenWidth > 500">GF</th>
              <th class="ga" v-show="screenWidth > 500">GA</th>
              <th class="gd" v-show="screenWidth <= 500">GD</th>
              <th class="points">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in leaderboardData" :key="team.teamName">
              <td><img :src="`https://flagsapi.codeaid.io/${team.teamName}.png`" /> <b>{{ team.teamName }}</b></td>
              <td class="mp">{{ team.matchesPlayed }}</td>
              <td class="gf" v-show="screenWidth > 500">{{ team.goalsFor }}</td>
              <td class="ga" v-show="screenWidth > 500">{{ team.goalsAgainst }}</td>
              <td class="gd" v-show="screenWidth <= 500">{{ team.goalsFor - team.goalsAgainst }}</td>
              <td class="points"><b>{{ team.points }}</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import LeagueService from '@/services/LeagueService';

  
  export default {
   
    data() {
      return {
        leaderboardData: [],
        screenWidth: window.innerWidth
      };
    },
    async created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      const leagueService = new LeagueService();
      await leagueService.fetchData();
      this.leaderboardData = leagueService.getLeaderboard();
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      handleResize() {
        this.screenWidth = window.innerWidth;
      }
    }
  }
  </script>
  
  <style scoped>
    table {
      width: 90%;
      margin: auto;
      border-collapse: collapse;
      color: #4B5C68;
    }

    thead {
      height: 40px;
    }

    tbody > tr {
      height: 70px;
    }

    
    th, td {
      border-top: 1px solid #E4EDF2;
      border-bottom: 1px solid #E4EDF2;
      padding: 8px;
      text-align: left;
    }

   
    th {
      background-color: #E4EDF2;
      font-size: 12px;
    }

   
    th:first-child, th:last-child {
      border-left: none;
      border-right: none;
    }

   
    td {
      font-size: 14px;
      border-left: none;
      border-right: none;
    }

    td > img {
      width: 53px;
      height: 37px;
      vertical-align: middle; 
      margin-right: 10px; 
    }

   
    td b {
      font-size: 16px;
    }

    .mp, .gf, .ga, .gd, .points{
      text-align: center;
    }
    
    td.points{
      color: #025FEB;
    }

    

</style>