<template>
  <div class="app-description">
      <h1 class="title">Media Explorer</h1>
      <p class="description">Приложение `Media Explorer` занимается визуализацией и поддержкой данных, размещенных в различных хранилищах.</p>
      <p class="description">Содержится из трех приложений:</p>
      <ol class="app-list">
          <li class="app-item"><b>s_media_front:</b> frontend для пользователей, разработанный на Vue.js 3. Отправляет API-запросы на bakend и отображает полученные ответы.<br />
            <a href="https://github.com/SergueiMoscow/s_media_front" target="_blank">Репозиторий на GitHub</a>
          </li>
          <li class="app-item"><b>s_media_api:</b> Backend часть, работает на Python и Django DRF. Он обрабатывает API-запросы от frontend, решает, к какому серверу следует обратить запрос, и перенаправляет его туда.<br />
            <a href="https://github.com/SergueiMoscow/s_media_api" target="_blank">Репозиторий на GitHub</a>
          </li>
          <li class="app-item"><b>Media Cataloger:</b> Принимает и обрабатывает запросы от backend. Обеспечивает доступ к папкам и файлам, а также предоставляет информацию о файлах.<br />
            <a href="https://github.com/SergueiMoscow/s_media_service" target="_blank">Репозиторий на GitHub</a>
          </li>
          <li class="app-item"><b>Помощник деплоя</b>Ansible playbooks для установки компонентов системы<br />
            <a href="https://github.com/SergueiMoscow/s_media_deploy" target="_blank">Репозиторий на GitHub</a>
          </li>
      </ol>
      <img src="s_media_schema.png" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
name: "AppDescription",
});
</script>

<style scoped>
.app-description {
color: #333;
font-family: Arial, sans-serif;
margin: 0 auto;
padding: 20px;
max-width: 800px;
}
.title {
text-align: center;
font-size: 2em;
margin-bottom: 20px;
}
.description {
margin-bottom: 10px;
}
.app-list {
margin-bottom: 10px;
}
.app-item {
margin-bottom: 10px;
}
img {
  max-width: 800px;
}
</style>
