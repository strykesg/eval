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

</style>
