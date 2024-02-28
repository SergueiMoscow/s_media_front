<template>
  <div class="main">
    <h1 class="title">Каталогизатор систем хранения изображений.</h1>
    <div class="folder-container">
    <!-- <div class="folder-card" v-for="file in files" :key="file.note"> -->
      <FileViewComponent
        v-for="file in files"
        :key="file.note"
        :file="file"
        />
    <!-- </div> -->
  </div>

</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import FileViewComponent from "@/components/FileViewComponent.vue";
import { CatalogObject } from '@/types';
import apiClient from '@/apiClient';


export default defineComponent({
  components: {
    FileViewComponent,
  },
  setup() {
    const files = ref<CatalogObject[]>([]);

    onMounted(async() => {
      const response = await apiClient.get('/main/')
      files.value = response?.data.results.files
      console.log(files.value)
    })
    return { files }

  },
})
</script>


<style scoped>
@import "/css/folders.css";

.main {
color: #333;
font-family: Arial, sans-serif;
margin: 0 auto;
padding: 20px;
min-width: 800px;
}

.title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
  }
</style>