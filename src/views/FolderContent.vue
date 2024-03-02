<template>
  <div class="header">
    <div>Сервер:</div>
    <div>Хранилище: {{ storage_name }}</div>
    <!--div>Папка {{ folder_name }}</div -->
    <FolderPathComponent
      :server_id="server_id"
      :storage_id="storage_id"
      :folder_path="folder_path"
    />
  </div>
  <div class="folder-container">
    <div class="folder-card" v-for="folder in folders" :key="folder.storage_id">
      <FolderCardComponent :folder="folder" />
    </div>
  </div>
  <div class="folder-container">
    <FileCardComponent
      v-for="file in files"
      :key="file.name"
      :file="file"
      :folder_data="folder_data"
      :all_tags="available_tags"
    />
  </div>
  <Pagination 
    v-model="currentPage"
    :total="totalItems"
    :limit=20
    @update:modelValue="onChangePageHandler"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "vue";
import FolderCardComponent from "@/components/FolderCardComponent.vue";
import FolderPathComponent from "@/components/FolderPathComponent.vue";

import FileCardComponent from "@/components/FileCardComponent.vue";
import apiClient from "@/apiClient";
import { Folder, ParametersFolderView, FileObject } from "@/types";
import { useRoute } from "vue-router";
import { loadCollage, processFolder } from "@/views/useFolderContent";
import { navigateToFolder } from "./useNavigation";
import Pagination from "@/components/Pagination.vue"

export default defineComponent({
  name: "FolderContent",
  components: {
    FolderPathComponent,
    FolderCardComponent,
    FileCardComponent,
    Pagination,
  },
  setup() {
    const folders = ref<Folder[]>([]);
    const files = ref<FileObject[]>([]);
    const folder_data = ref<ParametersFolderView>();
    const route = useRoute();
    const storage_name = ref();
    const folder_name = ref();
    const available_tags = ref();
    const server_id = ref();
    const storage_id = ref();
    const folder_path = ref();
    const currentPage = ref();
    const totalItems = ref(0);

    const refresh = async (params?: ParametersFolderView) => {
      files.value = [];
      folders.value = [];
      const page = route.query.page ? Number(route.query.page) : 1
      try {
        server_id.value = params?.server;
        storage_id.value = params?.storage;
        folder_path.value = params?.folder_path;
        const url = params && params.server ? 
          `/storage/${params.server}/${params.storage}/?folder=${params.folder_path}&page=${page}` 
          : "/servers_content/"
        console.log(`Fetching ${url}`)
        const response = await apiClient.get(url)
        folder_data.value = params;
        console.log("Content response:");
        console.log(response);
        if (response.data) {
          storage_name.value = response.data.results.storage_name;
          folder_name.value = response.data.results.path;
          files.value = response.data.results?.files || [] ;
          currentPage.value = response.data.pagination?.page || 1

          const folderPromises = response.data.results.folders.map(
            async (folder: Folder) => {
              return await processFolder(folder, params);
            }
          );

          // Используем Promise.all для ожидания завершения всех асинхронных операций
          folders.value = await Promise.all(folderPromises);
        }
        // tags

        if (params?.server) {
          const response_tags = await apiClient.get(
            `/catalog/tags/${params?.server}/`
          );
          available_tags.value = response_tags?.data.results;
        } else {
          available_tags.value = [];
        }
        // pagination
        if (response.data.pagination) {
          currentPage.value = response.data.pagination.page;
          totalItems.value = response.data.pagination.items;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const onChangePageHandler = async (page: number) => {
      console.log(`Page: ${page}`);
      currentPage.value = page;
      navigateToFolder(
        server_id.value,
        storage_id.value,
        folder_path.value,
        currentPage.value
      );
    };

    onMounted(async () => {
      const params: ParametersFolderView = {
        server: route.params.server?.toString() || "",
        storage: route.params.storage?.toString() || "",
        folder_path: route.params.folder_path?.toString() || "",
        page: route.query.page ? Number(route.query.page) : 1,
      };
      console.log("onMounted FolderContent", params);
      console.log("currentPageValue before", currentPage.value);
      currentPage.value = params.page;
      await refresh(params);
      console.log("currentPageValue after", currentPage.value);
    });

    watch(
      () => route.params,
      async () => refresh(route.params as unknown as ParametersFolderView),

      // (newParams) => {
      //   refresh(newParams as unknown as ParametersFolderView);
      // },
      // { immediate: true }
    );

    return {
      folders,
      files,
      loadCollage,
      folder_data,
      storage_name,
      folder_name,
      available_tags,
      server_id,
      storage_id,
      folder_path,
      currentPage,
      onChangePageHandler,
      totalItems,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  background-color: #f7f7f7;
  border-bottom: 1px solid #eee;
  margin-bottom: 1em;
}

.folder-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 1em;
}

.folder-card {
  margin: 1em 0.5em;
  transition: box-shadow 0.3s ease;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 600px) {
  .folder-card {
    width: calc(100% - 2em);
  }
}
</style>
