<template>
  <div class="folder-container">
    <div class="folder-card" v-for="folder in folders" :key="folder.storage_id">
      <FolderCardComponent
        :folder="folder"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "vue";
import FolderCardComponent from "@/components/FolderCardComponent.vue";
import apiClient from "@/apiClient";
import { Folder, ParametersFolderView } from "@/types";
import { useRoute } from 'vue-router'


function arrayBufferToBase64(buffer: any): string {
  if (buffer instanceof ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    if (len === 0) {
      console.error("Buffer has no data.");
      return "";
    }
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } else {
    console.error("The input is not an ArrayBuffer.");
    return "";
  }
}

export default defineComponent({
  components: {
    FolderCardComponent,
  },
  setup() {
    const folders = ref<Folder[]>([]);
    const route = useRoute()

    const loadCollage = async (
      server_id: String,
      storage_id: String,
      folder: String
    ) => {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/folder_collage/${server_id}/${storage_id}/?folder=${folder}&timestamp=${new Date().getTime()}&rand=${Math.random()}`;
      const response = await apiClient.get(url, {
        responseType: "arraybuffer",
      });
      console.log(`LoadCollage ${server_id}, ${storage_id}, ${folder}`)
      console.log(`LoadCollage url ${url}`)

      return response.data;
    };
    
    const refresh = async (params?: ParametersFolderView) => {
      try {
        // const url = (params && params.server)
        //   ? `/storage/${params.server}/${params.storage}/?folder=${params.folder}`
        //   : "/servers_content/"
        // const response = apiClient.get(url)
        const response = (params && params.server)
          ? await apiClient.get(`/storage/${params.server}/${params.storage}/?folder=${params.folder}`)
          : await apiClient.get("/servers_content/")
        console.log("Content response:");
        console.log(response);
        if (response.data) {
          // folders.value = response.data.results.folders;
          // 2 варианта img src:
          let imageSourceType = "js_func";
          if (imageSourceType == "direct") {
            // вариант img src='ссылка'. Так не добавляется header с токеном
            folders.value = response.data.results.folders.map((folder: Folder) => {
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
            });
          } else if (imageSourceType == "js_func") {
            // вариант img src='загруженная картинка'. Получаем её отдельным запросом
            const folderPromises = response.data.results.folders.map(
              async (folder: Folder) => {
                let serverId;
                if (folder.server_id != null) { // Проверяем, существует ли server_id в объекте folder
                  serverId = folder.server_id.toString();
                } else if (params && params.server && parseInt(params.server) > 0) { // Проверяем, валиден ли params.server и больше ли он нуля
                  serverId = params.server.toString();
                } else {
                  throw new Error('No valid server_id provided.');
                }

                let storageId;
                if (folder.storage_id != null) { // Проверяем, существует ли server_id в объекте folder
                  storageId = folder.storage_id;
                } else if (params && params.server && parseInt(params.server) > 0) { // Проверяем, валиден ли params.server и больше ли он нуля
                  storageId = params.storage;
                } else {
                  throw new Error('No valid server_id provided.');
                }

                // Здесь выполняем функцию loadCollage для каждой папки
                const collageBytesArray = await loadCollage(
                  serverId,
                  storageId,
                  folder.name
                );
                const collageImage = arrayBufferToBase64(collageBytesArray);
                const collageUrl = `data:image/jpeg;base64,${collageImage}`;

                return {
                  ...folder,
                  image_url: `${
                    import.meta.env.VITE_BACKEND_URL
                  }/folders_image?folders=${
                    folder.folders_count.direct
                  }&timestamp=${new Date().getTime()}&rand=${Math.random()}`,
                  collage_url: collageUrl, // Здесь вы будете использовать полученный URL в качестве значения
                };
              }
            );

            // Используем Promise.all для ожидания завершения всех асинхронных операций
            folders.value = await Promise.all(folderPromises);
          }
        }
      } catch (error) {
        console.error(error);
      }      
    }

    onMounted(async () => {
      const params: ParametersFolderView = {
        server: route.params.server?.toString() || '',
        storage: route.params.storage?.toString() || '',
        folder: route.params.folder?.toString() || '',
      }
      console.log('onMounted FolderContent')
      refresh(params)
    });


    watch(() => route.params, (newParams, oldParams) => {
      // Логика обновления, аналогично в том, что должно произойти при onMounted
      refresh(newParams as unknown as ParametersFolderView)
    }, { immediate: true })

    return {
      folders,
      loadCollage,
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
