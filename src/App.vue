<template>
  <v-app id="inspire">
    <app-bar :logged-in="isUserLoggedIn" @toggle-drawer="onDrawerIconClick" @login="navigateToLogin" @logout="logout"></app-bar>
    <v-navigation-drawer app v-model="drawer_visible">
      <v-list nav>
        <v-list-item
          v-for="(item, i) in filteredNavigationItems"
          :key="i"
          :value="item"
          base-color="primary"
          :to="item.path">
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>

      <router-view @auth-changed="triggerAuthUpdate">
      </router-view>

    </v-main>
  </v-app>
</template>


<script setup lang="ts">
import AppBar from './components/AppBar.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import mitt from 'mitt';

const drawer_visible = ref(false)
const router = useRouter()
const authTrigger = ref(false) // Используется для триггеринга изменения авторизации
const emitter = mitt(); // Создаем новый экземпляр mitt внутри этого компонента

onMounted(() => {
  emitter.on('auth-changed', triggerAuthUpdate);
});

onUnmounted(() => {
  emitter.off('auth-changed', triggerAuthUpdate);
});

function triggerAuthUpdate() {
  // Переключаем значение для триггеринга реактивности
  authTrigger.value = !authTrigger.value;
}

const isUserLoggedIn = computed(() => {
  authTrigger.value // Доступ к значению, чтобы использовать его в вычислении
  return !!localStorage.getItem('access_token')
})

const filteredNavigationItems = computed(() => {
  return navigation_items.filter(item => !item.requiresAuth || isUserLoggedIn.value);
});

function navigateToLogin() {
  router.push('/login')
  triggerAuthUpdate()
}
function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  // triggerAuthUpdate()
  emitter.emit('auth-changed');
}

function onDrawerIconClick() {
  drawer_visible.value = !drawer_visible.value
}
let navigation_items = [
  {
    title: 'Домашняя',
    value: 'home',
    icon: "mdi-home-outline",
    path: "/",
    requiresAuth: false,
  },
  {
    title: 'Процессы',
    value: 'processes',
    icon: "mdi-fast-forward",
    path: "/processes",
    requiresAuth: false,
  },
  {
    title: 'Хранилища',
    value: 'content',
    icon: "mdi-database",
    path: "/folder_content",
    requiresAuth: true,
  },
  {
    title: 'Серверы',
    value: 'storages',
    icon: "mdi-server",
    path: "/storages",
    requiresAuth: true,
  }
]
</script>
