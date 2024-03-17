<template>
  <div>
  <FilterComponent
    :filter="filterSettings"
    :all_tags="available_tags"
    @update:props="fetchData"
  ></FilterComponent>
  </div>

  <div class="folder-container" v-if="folder_data">
    <FileCardComponent
      v-for="file in files"
      :key="`${file.name ? file.name : ''}${file.id ? file.id : ''}`"
      :file="file"
      :folder_data="folder_data"
      :all_tags="available_tags"
      @tag-clicked="fileTagClicked"
    />
  </div>

  </template>

<script setup lang="ts">
import { ref, Ref, onMounted, watchEffect } from "vue";
import FileCardComponent from "@/components/FileCardComponent.vue";
import FilterComponent from "@/components/FilterComponent.vue";
import {defineEmits} from 'vue';

import apiClient from "@/apiClient";
import { RequestPrams, FileObject, ParametersFolderView, defaultCatalogRequest } from "@/types";
import { getAvailableTags } from "@/common";
import { prepareRequestParams } from "./useFolderContent";
const emits = defineEmits(['authChanged']);

const props = defineProps({
  server_id: { type: String, default: ''},
  storage_id: { type: String, default: ''},
});
const filterSettings: Ref<RequestPrams> = ref(defaultCatalogRequest());
const files = ref<FileObject[]>([]);
const folder_data = ref<ParametersFolderView>();
const available_tags = ref()
const fetchData = async (updatedFilter: RequestPrams) => {
  filterSettings.value = updatedFilter;
  const url = `/catalog_content/${props.server_id}/${props.storage_id}/`;
  const preparedRequestParams = prepareRequestParams(filterSettings.value)
  console.log('CatalogContent filterSettings: ', preparedRequestParams)
  const response = await apiClient.get(url, { params: preparedRequestParams });
  files.value = response.data.files
  folder_data.value = {
    server: props.server_id,
    storage: props.storage_id,
    folder_path: '',
    page: response.data.pagination.page,
  }
  console.log("response:", response);
  // tags
  available_tags.value = await getAvailableTags(props.server_id, files.value)
  return
};
onMounted(async () => {
  fetchData(filterSettings.value);
});
watchEffect(() => {
//  fetchData(filterSettings.value);
});

const fileTagClicked = (value: string) => {
  console.log(`CatalogComponent fileTagClicked ${value}`);

  const index = filterSettings.value.tags.indexOf(value);

  if (index === -1) {
    // Добавляем, если тега нет
    filterSettings.value.tags.push(value);
  } else {
    // Удаляем, если тег уже есть
    filterSettings.value.tags.splice(index, 1);
  }
  fetchData(filterSettings.value)
}

</script>
<style scoped>
@import "/css/folders.css";
</style>