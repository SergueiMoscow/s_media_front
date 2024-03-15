// Composables
import { RouteLocationNormalizedLoaded, createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
  },
  // {
  //   path: '/processes',
  //   component: () => import('@/components/CComponentTableProcesses.vue'),
  // },
  {
    path: '/about',
    component: () => import('@/views/Description.vue'),
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
    path: '/folder_content/:server?/:storage?/:folder_path?',
    component: () => import('@/views/FolderContent.vue'),
    props: true,
    meta: { key: (route: RouteLocationNormalizedLoaded) => route.fullPath },
  },
  {
    name: 'CatalogContent',
    path: '/catalog_content/:server_id?/:storage_id?/',
    component: () => import('@/views/CatalogContent.vue'),
    props: true,
    meta: { key: (route: RouteLocationNormalizedLoaded) => route.fullPath },
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
