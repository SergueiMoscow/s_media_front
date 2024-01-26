<!-- AppBar.vue -->
<template>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!loggedIn" @click="$emit('login')">
        Войти
      </v-btn>
      <v-btn v-else @click="$emit('logout')">
        Выйти
      </v-btn>
    </v-app-bar>
  </template>
  
  <script setup lang="ts">
  defineProps(['loggedIn']);
  defineEmits(['toggle-drawer', 'login', 'logout']);
  </script>
  