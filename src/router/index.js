import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import SearchResults from '@/pages/SearchResults.vue'
import MovieDetails from '@/pages/MovieDetails.vue'
import Popular from '@/pages/Popular.vue'
import TopRated from '@/pages/TopRated.vue'
import Trending from '@/pages/Trending.vue'
import Upcoming from '@/pages/Upcoming.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movie/:id', name: 'MovieDetails', component: MovieDetails },
  { path: '/search', name: 'Search', component: SearchResults },
  { path: '/popular', name: 'Popular', component: Popular },
  { path: '/top-rated', name: 'TopRated', component: TopRated },
  { path: '/trending', name: 'Trending', component: Trending },
  { path: '/upcoming', name: 'Upcoming', component: Upcoming },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
