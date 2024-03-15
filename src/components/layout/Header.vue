<template>
    <header>
      <nav>
        <div class="logo">
            Logo
        </div>
        <div class="routes">
            <ul class="nav-links">
                                
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
    nav {
        padding: 0 40px;
        display: flex;
        align-items: center; 
        justify-content: space-between;
        height: 60px;
        background: #025FEB;
        color: #FFFFFF;
        font-size: 16px;
    }
    .logo {
        width: 110px;
    }
    .routes .nav-links {
        list-style: none;
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    .routes .nav-links li {
        margin-left: 20px;
    }

    .nav-icon {
        width: 25px; 
        height: 25px;
        margin-left: 5px; 
    }
  </style>