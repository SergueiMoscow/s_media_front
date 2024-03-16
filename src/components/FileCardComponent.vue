<template>
  <div class="file-card">
    <input type="checkbox" class="file-card__checkbox" />
    <template v-if="isImage">
      <img
        :src="imageUrl"
        text="true"
        @click="fetchImage"
        class="file-card__img"
      />
    </template>
    <template v-else-if="isVideo">
      <video-player
        :poster="imageUrl"
        :src="fileUrl"
        :width="200"
        controls
        loop
        :volume="0.6"
      />
    </template>
    <div class="file-card__details">
      <div class="file-card__title">
        <EditableComponent
          v-model="note"
          @update:modelValue="handleNoteSave"
          placeholder="Заметки"
        />
      </div>
      <div class="file-card__title">{{ file.name }}</div>
      <div>
        <Multiselect
          v-model="tags_value"
          :options="all_tags"
          mode="tags"
          placeholder="Select your characters"
          :searchable="true"
          :createTag="true"
          :caret="false"
          @update:modelValue="handleTagChange"
          @select="tagSelect"
          @click="tagClick"
        />
      </div>
      <div>
        <input
          type="checkbox"
          class="file-card__checkbox"
          v-model="is_public"
          @change="onChangePublic"
        />
        public
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
import { FileObject, ParametersFolderView } from "@/types";
import { formatDate } from "@/common";
//@ts-ignore
import Multiselect from "@vueform/multiselect";
import apiClient from "@/apiClient";
import EditableComponent from "@/components/InputWithOk.vue";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";

export default defineComponent({
  name: "FileCardComponent",
  components: {
    Multiselect,
    EditableComponent,
    VideoPlayer,
  },
  props: {
    file: {
      type: Object as PropType<FileObject>,
      required: true,
    },
    folder_data: {
      type: Object as PropType<ParametersFolderView>,
      required: true,
    },
    all_tags: Array<string>,
  },
  setup(props) {
    const imageUrl = ref("");
    const fileUrl = ref("");
    const isImage = ["png", "jpg", "jpeg", "bmp", "svg", "webp"].includes(
      props.file.type.toLowerCase()
    );
    const isVideo = ["mp4", "webm", "ogv"].includes(
      props.file.type.toLowerCase()
    );

    const generateUrl = (
      path: string,
      folderData: ParametersFolderView,
      file: FileObject
    ) => {
      let url = `${import.meta.env.VITE_BACKEND_URL}/${path}/${
        folderData.server
      }`;

      if (file.name) {
        url += `/${folderData.storage}/`;
        url += `?folder=${encodeURIComponent(
          folderData.folder_path
        )}&filename=${file.name}`;
      }

      if (file.id) {
        url += `/${file.id}/`;
      }

      return url;
    };

    imageUrl.value = generateUrl('preview', props.folder_data, props.file);
    fileUrl.value = generateUrl('file', props.folder_data, props.file);

    const formatSize = (size: number) => {
      return (size / 1024).toFixed(2) + " KB";
    };
    const fetchImage = () => {};
    const file_created = formatDate(props.file.created_at);
    const tags_value = props.file.tags;
    const is_public = props.file.is_public;
    let note = props.file.note;
    const handleTagChange = async (newVal: any) => {
      let data: any
      if (props.file.name) {
        data = {
          folder_path: props.folder_data.folder_path,
          filename: props.file.name,
          tags: newVal,
        }
      }
      if (props.file.id) {
        data = {
          id: props.file.id,
          tags: newVal,
        }
      }
      await apiClient.post(
        `/storage/fileinfo/${props.folder_data.server}/${props.folder_data.storage}/`,
        data
      );
    };
    const tagSelect = (value: any) => {
      console.log(value);
    };
    const handleNoteSave = async (newVal: string) => {
      let data: any
      if (props.file.name) {
        data = {
          folder_path: props.folder_data.folder_path,
          filename: props.file.name,
          note: newVal,
        }
      }
      if (props.file.id) {
        data = {
          id: props.file.id,
          note: newVal,
        }
      }
      await apiClient.post(
        `/storage/fileinfo/${props.folder_data.server}/${props.folder_data.storage}/`,
        data
      );
      note = newVal;
    };
    const onChangePublic = async (event: any) => {
      let data: any
      if (props.file.name) {
        data = {
          folder_path: props.folder_data.folder_path,
          filename: props.file.name,
          is_public: event.target.checked,
        }
      }
      if (props.file.id) {
        data = {
          id: props.file.id,
          is_public: event.target.checked,
        }
      }
      await apiClient.post(
        `/storage/fileinfo/${props.folder_data.server}/${props.folder_data.storage}/`,
        data,
      );
      console.log(`changePublic: ${event.target.checked}`);
    };
    const tagClick = (event: any) => {
      const result = event.target.textContent || event.target.innerText;
      console.log('tagclick result: ', result)
    }
    return {
      fetchImage,
      formatSize,
      imageUrl,
      fileUrl,
      file_created,
      tags_value,
      handleTagChange,
      tagSelect,
      note,
      is_public,
      handleNoteSave,
      onChangePublic,
      isImage,
      isVideo,
      tagClick,
    };
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
