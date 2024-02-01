<template>
  <div class="folder-container">
    <div class="folder-card" v-for="folder in folders" :key="folder.storage_id">
      <FolderCardComponent
        :folder-name="folder.name"
        :storage-name="folder.storage_name"
        :server-name="folder.server_name"
        :folder-path="folder.path"
        :subfolder-count="folder.folders_count.direct"
        :total-subfolder-count="folder.folders_count.total"
        :file-count="folder.files_count.direct"
        :total-file-count="folder.files_count.total"
        :folder-image="folder.image_url"
        :file-image="folder.collage_url"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import FolderCardComponent from "@/components/FolderCardComponent.vue";
import apiClient from "@/apiClient";
import { Folder } from "@/types";

export default defineComponent({
  components: {
    FolderCardComponent,
  },
  setup() {
    const folders = ref<Folder[]>([]);

    onMounted(async () => {
      try {
        const response = await apiClient.get("/servers_content/");
        console.log("Content response:");
        console.log(response);

        if (response.data) {
          folders.value = response.data.results;
          folders.value = response.data.results.map((folder: Folder) => {
            return {
              ...folder,
              image_url: `${
                import.meta.env.VITE_BACKEND_URL
              }/folders_image?folders=${folder.folders_count.direct}&timestamp=${new Date().getTime()}&rand=${Math.random()}`,
              collage_url: `${import.meta.env.VITE_BACKEND_URL}/folder_collage/${folder.server_id}/${folder.storage_id}/?folder=&timestamp=${new Date().getTime()}&rand=${Math.random()}`
            };
          });
        }
      } catch (error) {
        console.error(error);
      }
    });

    return {
      folders,
    };
  },
});
</script>

<style scoped>
.folder-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.folder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  max-width: 300px;
  padding: 0;
  margin: 1em;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}


@media screen and (min-width: 800px) {
  .folder-card {
    max-width: calc((100% - 4em) / 2);
  }
}

@media screen and (min-width: 1000px) {
  .folder-card {
    max-width: calc((100% - 6em) / 3);
  }
}
</style>
