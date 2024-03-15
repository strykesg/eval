<template>
    <footer>
      <div class="apiVersion">
        API Version: 1.0
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'AppFooter'
  }
  </script>
  
  <style scoped>
    footer {
      display: flex;
      align-items: center; 
      justify-content: right;
      height: 40px;
      background: #F6F7F7;
      color: #4B5C68
    }
    .apiVersion { 
      margin-right: 40px;
      text-align: right;
    }
  </style>