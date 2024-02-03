// Composables
import { RouteLocationNormalizedLoaded, createRouter, createWebHistory } from 'vue-router'

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
  },
  {
    path: '/storages',
    component: () => import('@/views/Storage.vue'),
  },
  {
    path: '/folder_content',
    component: () => import('@/views/FolderContent.vue'),
    props: true,
  },  
  {
    name: 'FolderContent',
    path: '/folder_content/:server?/:storage?/:folder?',
    component: () => import('@/views/FolderContent.vue'),
    props: true,
    meta: { key: (route: RouteLocationNormalizedLoaded) => route.fullPath },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
