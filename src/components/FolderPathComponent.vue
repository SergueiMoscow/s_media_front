<template>
    <div>
      <span>Папка:</span>
      <a href="#" @click="folderClickHandler('')">&lt;корень&gt;</a>
      <span v-if="folderParts.length > 0"> / </span>
      <span v-for="(part, index) in folderParts" :key="index">
        <a href="#" @click="folderClickHandler(part.path)">
          {{ part.name }}
        </a>
        <!-- Do not add separator after the last item -->
        <span v-if="index < folderParts.length - 1"> / </span>
      </span>
    </div>
  </template>
  
  <script lang="ts">
  import { navigateToFolder } from '@/views/useNavigation';
import { defineComponent, PropType, computed } from 'vue';
  
  export default defineComponent({
    name: 'Breadcrumb',
  
    props: {
      server_id: {
        type: String as PropType<string>,
        required: true
      },
      storage_id: {
        type: String as PropType<string>,
        required: true
      },
      folder_path: {
        type: String as PropType<string>,
        required: true
      }
    },
  
    setup(props) {
        const  folderClickHandler = (part_path: string) => {
          console.log(`FolderPathComponent part_path: ${part_path}`)
      navigateToFolder(props.server_id, props.storage_id, part_path) 
    };
  
    const folderParts = computed(() => {
      if (!props.folder_path) {
        return []
      }
      const parts = props.folder_path.split('/').filter(part => part.length > 0);
      return parts.map((part, index) => {
        // Fix to create a path up to the current part instead of including all parts
        const pathToPart = parts.slice(0, index + 1).join('/');
        return {
          name: part,
          // Now the path will correctly point to the folder that the breadcrumb represents
          path: `${pathToPart}`
        };
      });
    });
  
      return {
        folderParts,
        folderClickHandler,
      };
    }
  });
  </script>
  
  <style scoped>
  a {
    cursor: pointer;
    /* Additional styling */
  }
  </style>