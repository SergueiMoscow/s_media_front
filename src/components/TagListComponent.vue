<template>
    <div class="tags-container">
      <span
        v-for="tag in tags"
        :key="tag"
        class="tag"
        @click="onTagClick(tag)"
      >{{ tag }}</span>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    name: 'TagList',
    props: {
      tags: {
        type: Array as PropType<string[]>,
        required: true,
      },
      onTagSelected: {
        type: Function as PropType<(tag: string) => void>,
        required: true
      },
    },
    methods: {
      onTagClick(tag: string) {
        this.onTagSelected(tag);
      }
    }
  });
  </script>
  
  <style scoped>
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .tag {
    background-color: #efefef;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
  }
  </style>