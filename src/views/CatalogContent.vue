<template>
  <div>
  <FilterComponent></FilterComponent>
  </div>

  <div class="folder-container" v-if="folder_data">
    <FileCardComponent
      v-for="file in files"
      :key="`${file.name ? file.name : ''}${file.id ? file.id : ''}`"
      :file="file"
      :folder_data="folder_data"
      :all_tags="available_tags"
    />
  </div>

  </template>

<script setup lang="ts">
import { ref, Ref, onMounted, watchEffect } from "vue";
import FileCardComponent from "@/components/FileCardComponent.vue";
import FilterComponent from "@/components/FilterComponent.vue";
import {defineEmits} from 'vue';

import apiClient from "@/apiClient";
import { CatalogRequest, FileObject, ParametersFolderView, defaultCatalogRequest } from "@/types";
import { getAvailableTags } from "@/common";
const emits = defineEmits(['authChanged']);

const props = defineProps({
  server_id: { type: String, default: ''},
  storage_id: { type: String, default: ''},
});
const filterSettings: Ref<CatalogRequest> = ref(defaultCatalogRequest());
const files = ref<FileObject[]>([]);
const folder_data = ref<ParametersFolderView>();
const available_tags = ref()
const fetchData = async () => {
  const url = `/catalog_content/${props.server_id}/${props.storage_id}/`;
  const response = await apiClient.get(url, { params: filterSettings.value });
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
  fetchData();
});
watchEffect(() => {
  fetchData();
});
</script>
<style scoped>
@import "/css/folders.css";
</style>