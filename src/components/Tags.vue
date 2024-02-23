<template>
  <div>
    <div v-for="(tag, index) in tags" :key="index">
      <span>{{ tag }}</span>
      <button @click="removeTag(index)">X</button>
    </div>
    <button v-if="!isAdding" @click="isAdding = true">+</button>
    <div v-if="isAdding">
      <input v-model="newTag" @input="filterTags" />
      <div v-if="filteredTags.length > 0">
        <div
          v-for="(tag, index) in filteredTags"
          :key="index"
          @click="selectTag(tag)"
        >
          {{ tag }}
        </div>
      </div>
      <button @click="addTag">OK</button>
      <button @click="cancelAdd">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    server_id: String,
    storage_id: String,
    file_path: String,
    tags: Array<string>,
  },
  setup(props) {
    const newTag = ref("");
    const isAdding = ref(false);
    const allTags = ref<Array<string>>([]);
    const filteredTags = ref<Array<string>>([]);
    const localTags = ref(props.tags ? [...props.tags] : []);

    const filterTags = () => {
      // Get all tags for the substring `newTag`
      filteredTags.value = allTags.value.filter((tag) =>
        tag.toLowerCase().includes(newTag.value.toLowerCase())
      );
    };

    const addTag = () => {
      localTags.value.push(newTag.value);
      newTag.value = "";
      isAdding.value = false;
    };

    const cancelAdd = () => {
      newTag.value = "";
      isAdding.value = false;
    };

    const removeTag = (index: number) => {
      localTags.value.splice(index, 1);
    };

    const selectTag = (tag: string) => {
      newTag.value = tag;
    };

    return {
      newTag,
      isAdding,
      filteredTags,
      filterTags,
      addTag,
      cancelAdd,
      removeTag,
      selectTag,
    };
  },
});
</script>
