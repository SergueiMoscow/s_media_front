<template>
  <v-app id="inspire">
    <v-app-bar app>

      <v-app-bar-nav-icon @click="onDrawerIconClick">
      </v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
      <!-- Кнопка для входа/выхода -->
      <v-spacer></v-spacer>
      <!-- Этот компонент используется для добавления пространства и выравнивания элементов справа -->
      <v-btn v-if="!isUserLoggedIn" @click="navigateToLogin">
        Войти
      </v-btn>
      <v-btn v-else @click="logout">
        Выйти
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer_visible">
      <v-list nav>
        <v-list-item v-for="(item, i) in navigation_items" :key="i" :value="item" base-color="primary" :to="item.path">
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
    path: "/"
  },
  {
    title: 'Процессы',
    value: 'processes',
    icon: "mdi-fast-forward",
    path: "/processes"
  },
  {
    title: 'Hello world!',
    value: 'hello_world',
    icon: "mdi-earth",
    path: "/hello_world"
  }
]


</script>
