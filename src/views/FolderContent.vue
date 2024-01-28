<template>
    <div>
      <div v-for="folder in folders" :key="folder.name">
        <p>{{ folder.server_name }}</p>
        <p>{{ folder.name }}</p>
        <p>{{ folder.path }}</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import apiClient from "@/apiClient";

  interface Folder {
    server_name: string;
    name: string;
    path: string;
  }
  
  export default defineComponent({
    setup() {
      const folders = ref<Folder[]>([])
  
      onMounted(async () => {
        try {
          const response = await apiClient.get('/servers_content/')
          console.log('Content response:')
          console.log(response)
          
          if (response.data) {
            folders.value = response.data.results
          }
        } catch (error) {
          console.error(error)
        }
      })
  
      return {
        folders,
      }
    },
  })
  </script>
  