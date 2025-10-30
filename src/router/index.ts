import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('@/views/DiscoverView.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/top-opinions',
    name: 'TopOpinions',
    component: () => import('@/views/TopOpinionsView.vue'),
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('@/views/UploadMovieView.vue'),
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: () => import('@/views/MovieDetailView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
