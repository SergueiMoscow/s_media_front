<template>
  <div class="header">
    <div>Сервер:</div>
    <div>Хранилище: {{ storage_name }}</div>
    <div>Папка {{ folder_name }}</div>
  </div>
  <div class="folder-container">
    <div class="folder-card" v-for="folder in folders" :key="folder.storage_id">
      <FolderCardComponent :folder="folder" />
    </div>
  </div>
  <div class="folder-container">
    <div class="folder-card" v-for="file in files" :key="file.name">
      <FileCardComponent
        :file="file"
        :folder_data="folder_data"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "vue";
import FolderCardComponent from "@/components/FolderCardComponent.vue";
import FileCardComponent from "@/components/FileCardComponent.vue";
import apiClient from "@/apiClient";
import { Folder, ParametersFolderView, FileObject } from "@/types";
import { useRoute } from "vue-router";
import { loadCollage, processFolder } from "@/views/useFolderContent";

export default defineComponent({
  components: {
    FolderCardComponent,
    FileCardComponent,
  },
  setup() {
    const folders = ref<Folder[]>([]);
    const files = ref<FileObject[]>([]);
    const folder_data = ref<ParametersFolderView>()
    const route = useRoute();
    const storage_name = ref()
    const folder_name = ref()

    const refresh = async (params?: ParametersFolderView) => {
      files.value = []
      folders.value = []
      try {
        const response =
          params && params.server
            ? await apiClient.get(
                `/storage/${params.server}/${params.storage}/?folder=${params.folder}`
              )
            : await apiClient.get("/servers_content/");
            folder_data.value = params
        console.log("Content response:");
        console.log(response);
        if (response.data) {
          storage_name.value = response.data.results.storage_name
          folder_name.value = response.data.results.path
          files.value = response.data.results.files
          // folders.value = response.data.results.folders;
          // 2 варианта img src:
          let imageSourceType = "js_func";
          if (imageSourceType == "direct") {
            // вариант img src='ссылка'. Так не добавляется header с токеном
            folders.value = response.data.results.folders.map(
              (folder: Folder) => {
                return {
                  ...folder,
                  image_url: `${
                    import.meta.env.VITE_BACKEND_URL
                  }/folders_image?folders=${
                    folder.folders_count.direct
                  }&timestamp=${new Date().getTime()}&rand=${Math.random()}`,
                  collage_url: `${
                    import.meta.env.VITE_BACKEND_URL
                  }/folder_collage/${folder.server_id}/${
                    folder.storage_id
                  }/?folder=&timestamp=${new Date().getTime()}&rand=${Math.random()}`,
                };
              }
            );
          } else if (imageSourceType == "js_func") {
            // вариант img src='загруженная картинка'. Получаем её отдельным запросом
            const folderPromises = response.data.results.folders.map(
              async (folder: Folder) => {
                return await processFolder(folder, params);
              }
            );

            // Используем Promise.all для ожидания завершения всех асинхронных операций
            folders.value = await Promise.all(folderPromises);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(async () => {
      const params: ParametersFolderView = {
        server: route.params.server?.toString() || "",
        storage: route.params.storage?.toString() || "",
        folder: route.params.folder?.toString() || "",
      };
      console.log("onMounted FolderContent");
      refresh(params);
    });

    watch(
      () => route.params,
      (newParams) => {
        // Логика обновления, аналогично в том, что должно произойти при onMounted
        refresh(newParams as unknown as ParametersFolderView);
      },
      { immediate: true }
    );

    return {
      folders,
      files,
      loadCollage,
      folder_data,
      storage_name,
      folder_name,
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  max-width: 300px;
  padding: 1em;
  margin: 1em 0.5em;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

@media screen and (min-width: 800px) {
  .folder-card {
    max-width: calc((100% - 4em - 2em) / 2);
  }
}

@media screen and (min-width: 1000px) {
  .folder-card {
    max-width: calc((100% - 6em - 3em) / 3);
  }
}
</style>
