<template>
    <div class="file-card">
      <img :src="imageUrl" text="true" @click="fetchImage" class="file-card__img" />
      <div class="file-card__details">
        <div class="file-card__title">
          <div>{{ note }}</div>
        </div>
        <div>
          <TagList 
            :tags="tags"
            :onTagSelected="handleTagClick"
          />
        </div>
        <div class="file-card__info">
          <span>{{ file.type }} - {{ formatSize(file.size) }}</span>
          <span class="file-card__info--subtext">{{ file_created }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, ref } from "vue";
  import { CatalogObject } from "@/types";
  import {formatDate }from '@/common'
  //@ts-ignore
  import apiClient from "@/apiClient";
  import TagList from './TagListComponent.vue';

  
  export default defineComponent({
    name: "FileViewComponent",
    props: {
      file: {
        type: Object as PropType<CatalogObject>,
        required: true,
      },
    },
    components: {
      TagList
    },
    setup(props) {
      const imageUrl = ref("");
      imageUrl.value = `${import.meta.env.VITE_BACKEND_URL}/preview/${
        props.file?.server_id
      }/${
        props.file?.id
      }`;
      const formatSize = (size: number) => {
        return (size / 1024).toFixed(2) + " KB";
      };
      const fetchImage = () => {};
      const file_created = formatDate(props.file.created_at)
      const tags = props.file.tags;
      console.log(`tags: ${tags}`)
      const note = props.file.note;
      const handleTagClick = async (tag: string) => {
      console.log(`Tag ${tag} was clicked`);
      // Здесь может быть ваша логика для подгрузки другой страницы
    }
      return { fetchImage, formatSize, imageUrl, file_created, tags, note, handleTagClick };
    },
  });
  </script>
  <style src="@vueform/multiselect/themes/default.css"></style>
  
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
  
  .file-card__title {
     text-align: center;
     color: #333;
  }
  
  .file-card__details {
    width: 100%;
  }
  
  .file-card__info {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #999;
  }
  
  .file-card__info--created {
    font-size: 0.8rem;
  }
  
  
  .file-card__img {
    /* стили для изображения */
    max-width: 100%;
    /* aspect-ratio: 16 / 9; */
    margin: 0.5em 0;
    cursor: pointer;
  }
  </style>
  