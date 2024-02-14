<template>
  <div class="folder-card__container">
    <div class="folder-card__details">
      <div class="folder-card__title">{{ folder.name }}</div>
      <div class="folder-card__info">
        {{ folder.storage_name }}
        <span class="folder-card__info--subtext">({{ folder.server_name }})</span>
      </div>
      <div class="folder-card__image">
        <div>
          <img :src="folder.image_url" class="folder-card__img" alt="folder" />
        </div>
        Папок: {{ folder.folders_count.direct }}
        <span class="folder-card__info--subtext"
          >(всего {{ folder.folders_count.total }})</span
        >
      </div>
      <div class="folder-card__info">
        <div>
          <img
            :src="folder.collage_url"
            class="folder-card__img"
            alt="file"
            @click="navigateToFolder(folder)"
          />
        </div>
        Файлов: {{ folder.files_count.direct }}
        <span class="folder-card__info--subtext"
          >(всего {{ folder.files_count.total }})</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Folder } from "@/types";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {
    folder: {
      type: Object as () => Folder,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const  navigateToFolder = (folder: Folder) => {
      router.push({
        name: "FolderContent",
        params: {
          server: folder.server_id,
          storage: folder.storage_id,
          folder_path: folder.path,
        },
      });
    };

    return { navigateToFolder}
  },
});
</script>

<style scoped>
.folder-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  padding: 1em;
  margin: 1em;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.folder-card__details {
  margin: 1em 0;
}

.folder-card__title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.5em;
  text-align: center;
}

.folder-card__info,
.folder-card__image {
  font-size: 0.9em;
  color: #333;
  text-align: center;
}

.folder-card__image {
  width: 100%;
}

.folder-card__info--subtext {
  font-size: 0.7em;
  color: #999;
}

.folder-card__img {
  max-width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0.5em 0;
  cursor: pointer;
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
