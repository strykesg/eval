<template>
  <div class="welcomeMessage">
    <AppHeader />
    <router-view />
  </div>
</template>

<style>
@import "./index.css";

.welcomeMessage {
  margin: 120px auto;
  width: 50%;
  text-align: left;
  font-size: 24px;
}
</style>
