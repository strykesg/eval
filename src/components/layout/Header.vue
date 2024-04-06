<template>
    <header>
      <nav>
        <div class="logo">
            <img src="/images/logo.svg" alt="League Web UI" />
        </div>
        <div class="routes">
            <ul class="nav-links">
                <li><router-link to="/"><img src="/images/schedule.png" class="nav-icon" /> Schedule</router-link></li>
                <li><router-link to="/leaderboard"><img src="/images/leaderboard.png" class="nav-icon" />Leaderboard</router-link></li>
            </ul>
        </div>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'AppHeader'
  }
  </script>
  
  <style scoped>
    a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color:#FFFFFF;
        
    }
    a img {
      margin-right: 5px;
    }
  </style>