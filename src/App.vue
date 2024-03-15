<template>
  <v-app id="inspire">
    <app-bar
      :logged-in="isUserLoggedIn"
      @toggle-drawer="onDrawerIconClick"
      @login="navigateToLogin"
      @logout="logout"
    ></app-bar>
    <v-navigation-drawer app v-model="drawer_visible">
      <v-list nav>
        <template v-for="(item, i) in filteredNavigationItems" :key="i">
          <v-list-item
            v-if="item.value != 'catalogs'"
            base-color="primary"
            :to="item.path"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <template v-if="item.value == 'catalogs'">
            <v-list-group value="catalogs">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :title="item.title"
                  base-color="primary"
                >
                  <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                  </template>
                </v-list-item>
              </template>

              <v-list-item
                v-for="(storage, i) in storages"
                :key="i"
                prepend-icon="mdi-folder"
                :title="storage.name"
                :value="storage.id"
                base-color="primary"
                :to="{ name: 'CatalogContent', params: { server_id: storage.server_id, storage_id: storage.id} }"
              ></v-list-item>
            </v-list-group>
          </template>
        </template>

        <!-- <v-list-item
          v-for="(item, i) in filteredNavigationItems"
          :key="i"
          :value="item"
          base-color="primary"
          :to="item.path"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view @auth-changed="triggerAuthUpdate"> </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from "./components/AppBar.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import mitt from "mitt";
import apiClient from "./apiClient";

const drawer_visible = ref(false);
const router = useRouter();
const authTrigger = ref(false); // Используется для триггеринга изменения авторизации
const emitter = mitt(); // Создаем новый экземпляр mitt внутри этого компонента
const storages = ref<Storage[]>([]);

let navigation_items = [
  {
    title: "Домашняя",
    value: "home",
    icon: "mdi-home-outline",
    path: "/",
    requiresAuth: false,
  },
  {
    title: "Каталоги",
    value: "catalogs",
    icon: "mdi-folder-multiple-image",
    path: "/catalog_content",
    requiresAuth: true,
  },
  {
    title: "Хранилища",
    value: "content",
    icon: "mdi-database",
    path: "/folder_content",
    requiresAuth: true,
  },
  {
    title: "Серверы",
    value: "storages",
    icon: "mdi-server",
    path: "/storages",
    requiresAuth: true,
    items: undefined,
  },
  {
    title: "О системе",
    value: "about",
    icon: "mdi-information-variant",
    path: "/about",
    requiresAuth: false,
  },
];

async function fetchStorages() {
  if (isUserLoggedIn.value) {
    const storagesList = await getStoragesList();
    const catalogsItemIndex = navigation_items.findIndex(
      (item) => item.value === "catalogs"
    );
    if (catalogsItemIndex !== -1) {
      storages.value = storagesList;
      console.log(`App.vue storages:`)
      console.log(storages.value);
    }
  }
}

onMounted(() => {
  emitter.on("auth-changed", triggerAuthUpdate);
  fetchStorages();
});

onUnmounted(() => {
  emitter.off("auth-changed", triggerAuthUpdate);
});

function triggerAuthUpdate() {
  // Переключаем значение для триггеринга реактивности
  authTrigger.value = !authTrigger.value;
}

const isUserLoggedIn = computed(() => {
  authTrigger.value; // Доступ к значению, чтобы использовать его в вычислении
  return !!localStorage.getItem("access_token");
});

const filteredNavigationItems = computed(() => {
  return navigation_items.filter(
    (item) => !item.requiresAuth || isUserLoggedIn.value
  );
});

function navigateToLogin() {
  router.push("/login");
  triggerAuthUpdate();
}
function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  emitter.emit("auth-changed");
}

function onDrawerIconClick() {
  drawer_visible.value = !drawer_visible.value;
}

async function getStoragesList() {
  const response = await apiClient.get(`/storages/`);
  return response.data.results;
}
</script>
