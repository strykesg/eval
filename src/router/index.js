import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Leaderboard from '../components/Leaderboard.vue';
import NotFound from '../components/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Home,
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard,
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;