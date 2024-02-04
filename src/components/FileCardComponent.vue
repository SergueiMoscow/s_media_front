<template>
    <div class="file-card">
      <img :src="imageUrl" @click="fetchImage" class="file-card__img" />
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
  import { defineComponent, PropType, ref } from 'vue';
  import { FileObject, ParametersFolderView } from "@/types";
  
  export default defineComponent({
    name: 'FileCardComponent',
    props: {
      file: {
        type: Object as PropType<FileObject>,
        required: true,
      },
      folder_data: {
        type: Object as PropType<ParametersFolderView>,
        required: true,
      }
      // serverId: {
      //   type: String,
      //   required: true,
      // },
      // storageId: {
      //   type: String,
      //   required: true,
      // },
      // folderPath: {
      //   type: String,
      //   required: true,
      // },
    },
    setup(props) {
      // const imageUrl = ref('')
      // const image = ref('')
      // const fetchImage = async () => {
      //   imageUrl.value = `${import.meta.env.VITE_BACKEND_URL}/${props.serverId}/${props.storageId}?folder=${encodeURIComponent(props.folderPath)}&file=${props.file.name}`;
      //   const response = await axios.get(imageUrl.value, {
      //     headers: {
      //       // Замените `YourToken` на актуальный токен авторизации
      //       'Authorization': `Bearer YourToken`, 
      //     },
      //     responseType: 'blob',
      //   });
  
      //   // Предполагается, что 'file.image_url' можно использовать для наполнения данными, в противном случае инициализируйте локальную reactive переменную и используйте её.
      //   if (props.file && response.data) {
      //     const blob = new Blob([response.data]);
      //     image.value = URL.createObjectURL(blob);
      //   }
      // };
  
      const imageUrl = ref('')
      imageUrl.value = `${import.meta.env.VITE_BACKEND_URL}/preview/${props.folder_data.server}/${props.folder_data.storage}/?folder=${encodeURIComponent(props.folder_data.folder)}&filename=${props.file.name}`;
      const formatSize = (size: number) => {
        // Пример простейшего форматера размера файла
        return (size / 1024).toFixed(2) + ' KB';
      };
      const fetchImage = ''
  
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