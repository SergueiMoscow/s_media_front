<template>
  <div class="file-card">
    <img :src="imageUrl" text="true" @click="fetchImage" class="file-card__img" />
    <div class="file-card__details">
      <div class="file-card__title">{{ file.name }}</div>
      <div class="file-card__info">
        {{ file.type }} - {{ formatSize(file.size) }}
        <span class="file-card__info--subtext">{{ file.created }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { FileObject, ParametersFolderView } from "@/types";

export default defineComponent({
  name: "FileCardComponent",
  props: {
    file: {
      type: Object as PropType<FileObject>,
      required: true,
    },
    folder_data: {
      type: Object as PropType<ParametersFolderView>,
      required: true,
    },
  },
  setup(props) {
    const imageUrl = ref("");
    imageUrl.value = `${import.meta.env.VITE_BACKEND_URL}/preview/${
      props.folder_data?.server
    }/${props.folder_data?.storage}/?folder=${encodeURIComponent(
      props.folder_data?.folder ? props.folder_data.folder : ""
    )}&filename=${props.file.name}`;
    const formatSize = (size: number) => {
      // Пример простейшего форматера размера файла
      return (size / 1024).toFixed(2) + " KB";
    };
    const fetchImage = () => {};

    return { fetchImage, formatSize, imageUrl };
  },
});
</script>

<style scoped>
.file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.file-card__img {
  /* стили для изображения */
  max-width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0.5em 0;
  cursor: pointer;
}
</style>
