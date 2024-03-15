<template>
  <div>
    <AppHeader />
    <div class="pageContent">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/layout/Header.vue'; 
import AppFooter from './components/layout/Footer.vue'; 

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style>
@import "./index.css";
body,html {
    margin: 0;
    padding: 0;
}
* {
    box-sizing: border-box;
}
.pageContent {
  text-align: center;
  margin-top: 60px;
  height: calc(100vh - 160px);
}
h1 { 
  font-size: 24px;
  color: #182C62;
  margin-bottom:20px;
}
</style>
