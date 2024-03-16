<template>
  <div>
    <h1>League Schedule</h1>
    <div>
      <table>
        <thead>
          <tr>
            <th v-show="screenWidth > 750">Date/Time</th>
            <th v-show="screenWidth > 1000">Stadium</th>
            <th class="home">Home Team</th>
            <th></th>
            <th class="away">Away Team</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(match, index) in matches" :key="index" :class="{ 'even-row': index % 2 === 0 }">
            <td v-show="screenWidth > 750">{{ formatDate(match.matchDate) }}</td>
            <td v-show="screenWidth > 1000">{{ match.stadium }}</td>
            <td class="bold team home">{{ match.homeTeam }} <img :src="`https://flagsapi.codeaid.io/${match.homeTeam}.png`" /></td> 
            <td class="bold">{{match.homeTeamScore}} : {{match.awayTeamScore}}</td>
            <td class="bold team away"><img :src="`https://flagsapi.codeaid.io/${match.awayTeam}.png`" /> {{ match.awayTeam }}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>
import LeagueService from '@/services/LeagueService';

export default {
  name: 'Home',
  data() {
    return {
      matches: [],
      screenWidth: window.innerWidth
    };
  },
  methods: {
    async fetchMatches() {
      console.log('fetching matches');
      const leagueService = new LeagueService();
      await leagueService.fetchData();
      this.matches = leagueService.getMatches();
    },
    formatDate(date) {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    }
   
  },
  mounted() {
      this.fetchMatches();
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

};
</script>
<style scoped>
table {
  width: 90%;
  margin:auto;
  border-collapse: collapse;
  color: #4B5C68;
  border: 1px solid #E4EDF2;
}

th {
  background-color: #E4EDF2;
  font-size: 12px;
  padding: 8px;
  border: 1px solid #E4EDF2;
}

thead {
  height: 40px;
}

tbody > tr {
  height: 70px;
}

tbody > tr, tbody > tr >td {
  border-left: none;
  border-right: none;
}

td {
  font-size: 14px; 
  padding: 8px;
  border: 1px solid #E4EDF2;
}

td.bold {
  font-size: 16px;
  font-weight: bold;
}
td.team {
  
  align-items: center;
  justify-content: center;
}
.home {
  text-align: right;
}
.away {
  text-align: left;
}

td > img {
  width: 53px;
  height:37px;
}

tr:nth-child(even) {
  background-color: #F6F7F7;
}


footer {
  color: #4B5C68;
  
}
</style>
