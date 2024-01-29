<template>
    <div class="folder-card1">
      <div class="folder-card__details">
        <div class="folder-card__title">{{ folderName }}</div>
        <div class="folder-card__info">{{ storageName }} <span class="folder-card__info--subtext">({{ serverName }})</span></div>
        <div class="folder-card__info">{{ folderPath }}</div>
        <div class="folder-card__info">
          <div><img :src="folderImage" class="folder-card__img" alt="folder" /></div>
          Папок: {{ subfolderCount }} 
          <span class="folder-card__info--subtext">(всего {{ totalSubfolderCount }})</span>
        </div>
        <div class="folder-card__info">
          <div><img :src="fileImage" class="folder-card__img" alt="file" /></div>
          Файлов: {{ fileCount }} 
          <span class="folder-card__info--subtext">(всего {{ totalFileCount }})</span>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    props: {
      folderName: String,
      storageName: String,
      serverName: String,
      folderPath: String,
      subfolderCount: Number,
      totalSubfolderCount: Number,
      fileCount: Number,
      totalFileCount: Number,
      folderImage: String,
      fileImage: String
    }
  })
  </script>
  
  <style scoped>
  .folder-card {
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
  
  .folder-card__details {
    margin: 1em 0;
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
  