<template>
    <footer>
      <div class="apiVersion">
        API Version: {{ apiVersion }}
      </div>
    </footer>
  </template>
  
  <script>
  import LeagueService from '@/services/LeagueService';

  export default {
    name: 'AppFooter',
    data() {
      return {
        apiVersion: "..."
      };
    },
    methods: {
      async fetchAPIVersion() {
        const leagueService = new LeagueService();
        await leagueService.fetchAPIVersion();
        this.apiVersion = leagueService.getAPIVersion();
      },
    },
    mounted() {
      this.fetchAPIVersion();
    }
  }
  </script>
  
  <style scoped>
    
  </style>