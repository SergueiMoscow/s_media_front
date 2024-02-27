<template>
  <div class="file-card">
    <input type="checkbox" class="file-card__checkbox" />
    <img :src="imageUrl" text="true" @click="fetchImage" class="file-card__img" />
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
          />
      </div>
      <div>
        <input type="checkbox" class="file-card__checkbox" v-model="is_public" @change="onChangePublic"/> public
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
import {formatDate }from '@/common'
//@ts-ignore
import Multiselect from '@vueform/multiselect'
import apiClient from "@/apiClient";
import EditableComponent from "@/components/InputWithOk.vue"


export default defineComponent({
  name: "FileCardComponent",
  components: {
    Multiselect,
    EditableComponent,
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
    imageUrl.value = `${import.meta.env.VITE_BACKEND_URL}/preview/${
      props.folder_data?.server
    }/${props.folder_data?.storage}/?folder=${encodeURIComponent(
      props.folder_data?.folder_path ? props.folder_data.folder_path : ""
    )}&filename=${props.file.name}`;
    const formatSize = (size: number) => {
      // Пример простейшего форматера размера файла
      return (size / 1024).toFixed(2) + " KB";
    };
    const fetchImage = () => {};
    const file_created = formatDate(props.file.created)
    const tags_value = props.file.tags;
    const is_public = props.file.is_public;
    let note = props.file.note;
    const handleTagChange = async (newVal: any) => {
        await apiClient.post(`/storage/fileinfo/${
          props.folder_data.server
        }/${
          props.folder_data.storage}/`,
          {
            folder_path: props.folder_data.folder_path,
            filename:props.file.name,
            tags: newVal,
          }
        )
    }
    const tagSelect = (value: any) => {
      console.log(value);
    }
    const handleNoteSave = async (newVal: string) => {
      await apiClient.post(`/storage/fileinfo/${
          props.folder_data.server
        }/${
          props.folder_data.storage}/`,
          {
            folder_path: props.folder_data.folder_path,
            filename:props.file.name,
            note: newVal,
          }
        )
        note = newVal
    }
    const onChangePublic = async (event: any) => {
      await apiClient.post(`/storage/fileinfo/${
          props.folder_data.server
        }/${
          props.folder_data.storage}/`,
          {
            folder_path: props.folder_data.folder_path,
            filename:props.file.name,
            is_public: event.target.checked,
          }
        )
      console.log(`changePublic: ${event.target.checked}`)

    }
    return { fetchImage, formatSize, imageUrl, file_created, tags_value, handleTagChange, tagSelect, note, is_public, handleNoteSave, onChangePublic };
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
