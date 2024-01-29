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
        :file-image="'https://example.com/fileimage.png'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import FolderCardComponent from "@/components/FolderCardComponent.vue";
import apiClient from "@/apiClient";
interface Count {
  direct: number;
  total: number;
}

interface Folder {
  name: string;
  time: string;
  size: number;
  folders_count: Count;
  files_count: Count;
  storage_id: string;
  storage_name: string;
  path: string;
  server_id: number;
  server_name: string;
  server_url: string;
  image_url: string;
}

export default defineComponent({
  components: {
    FolderCardComponent,
  },
  data() {
    return {
      folderInfo: {
        folderName: "Documents",
        storageName: "Main Storage",
        serverName: "Server 1",
        folderPath: "/root/documents",
        subfolderCount: 5,
        totalSubfolderCount: 13,
        fileCount: 10,
        totalFileCount: 24,
        folderImage: "https://example.com/folderimage.png",
        fileImage: "https://example.com/fileimage.png",
      },
    };
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
              }/folders_image?folders=${folder.folders_count.direct}`,
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
/*
.folder-card {
  flex: 1 1 content;  /* grow shrink basis Управляет размером. Исправьте на необходимый процент или другую единицу измерения * /
  margin: 10px;  /* Разделяет элементы. Исправьте на нужное значение * /
}
*/
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

.folder-card__details {
  margin: 0.2em 0;
}

.folder-card__title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.5em;
  text-align: center;
}

.folder-card__info {
  font-size: 0.9em;
  color: #333;
  text-align: left;
}

.folder-card__info--subtext {
  font-size: 0.7em;
  color: #999;
}

.folder-card__img {
  max-width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0.5em 0;
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
