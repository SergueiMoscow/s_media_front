// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
  },
  {
    path: '/processes',
    component: () => import('@/components/CComponentTableProcesses.vue'),
  },
  {
    path: '/hello_world',
    component: () => import('@/components/HelloWorld.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
