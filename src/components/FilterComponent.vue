<template>
  <div class="search-container">
    <div class="search-item">
      <v-text-field
        v-model="searchString"
        :loading="loading"
        append-inner-icon="mdi-magnify"
        append-icon="mdi-menu"
        density="compact"
        label="Search"
        hide-details
        single-line
        @click:append-inner="onSearchClick"
        @click:append="activateMenu"
      ></v-text-field>
    </div>
    <div class="search-item">
    <Multiselect
      v-model="searchParams.tags"
      :options="all_tags"
      mode="tags"
      placeholder="Поиск по тегам"
      :searchable="true"
      :createTag="true"
      :caret="false"
      @update:modelValue="handleTagChange"
      @select="tagSelect"
    />
  </div>

    <div class="search-item">
      <v-menu v-model="menu" :close-on-content-click="false" location="end">
        <v-card min-width="300">
          <v-list>
            <v-list-item
              base-color="primary"
              title="Фильтр"
              prepend-icon="mdi-filter"
            ></v-list-item>
          </v-list>
          <v-list>
            <v-list-item>
              <v-select
                v-model="selectPublished"
                :items="itemsPublished"
                density="compact"
                label="Фильтр по публикации"
              ></v-select>
            </v-list-item>
            <v-list-item>
              <v-switch
                v-model="searchParams.date_filter"
                color="primary"
                label="Фильтр по дате"
                hide-details
              ></v-switch>
            </v-list-item>
            <v-list-item v-if="searchParams.date_filter">
              Дата от
              <input
                type="date"
                v-model="searchParams.date_from"
                id="date_from"
              />
            </v-list-item>
            <v-list-item v-if="searchParams.date_filter">
              Дата до
              <input type="date" v-model="searchParams.date_to" id="date_to" />
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              title="Сортировка"
              base-color="primary"
              prepend-icon="mdi-sort"
            ></v-list-item>
            <v-list-item>
              <v-select
                v-model="orderField"
                :items="itemsOrderField"
                density="compact"
              ></v-select>
            </v-list-item>
            <v-list-item>
              <v-select
                v-model="orderDirection"
                :items="itemsOrderDirection"
                density="compact"
              ></v-select>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn variant="text" @click="menu = false"> Отмена </v-btn>
            <v-btn color="primary" variant="text" @click="onSearchClick">
              Поиск
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script lang="ts">
// https://vuetifyjs.com/en/components/menus/#activator-and-tooltip
import { ref, PropType, defineComponent } from "vue";
import Multiselect from "@vueform/multiselect";
// import DatePicker from '@/components/DatePicker.vue'
import { RequestPrams } from "@/types";
import {
  itemsOrderField,
  itemsOrderDirection,
  itemsPublished,
} from "./useFilterComponent";
export default defineComponent({
  name: "FilterComponent",
  components: {
    Multiselect,
  },

  props: {
    filter: { type: Object as PropType<RequestPrams>, required: true },
    all_tags: Array<string>,
  },

  setup(props, { emit }) {
   console.log("FilterComponent tags: ", props.all_tags)
  //  const emit = defineEmits(['update:props'])
   let searchParams = ref({ ...props.filter })

    let loading = ref(false);
    let menu = ref(false);
    let filterByDate = ref(false);
    let selectPublished = "all";
    let orderField = "created_at";
    let orderDirection = "desc";
    let searchString = ref('')
    const activateMenu = () => {
      menu.value = true;
    }
    const handleChange = () => {
      console.log("HandleChange searchParams", searchParams.value);
      menu.value = false;
      emit("update:props", searchParams.value);
    }

    const onSearchClick = () => {
      searchParams.value.search = searchString.value
      console.log('FilterComponent onSearchClick searchParams=', searchParams.value)
      handleChange();
    }

    const handleTagChange = async (newVal: any) => {
      searchParams.value.tags = newVal;
      emit("update:props", searchParams.value);
    }

    const tagSelect = (value: any) => {
      console.log(`FilterComponent TagSelect ${value}`);
      console.log('FilterComponent all_tags: ', props.all_tags)
    }
    return {
      loading,
      onSearchClick,
      activateMenu,
      menu,
      searchParams,
      handleTagChange,
      tagSelect,
      selectPublished,
      itemsPublished,
      filterByDate,
      orderField,
      itemsOrderField,
      orderDirection,
      itemsOrderDirection,
      searchString,
     }
  },
});
</script>
<style src="@vueform/multiselect/themes/default.css"></style>

<style scoped>
.search-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 1em;
  padding-left: 1em;
  padding-right: 1em;
}
.search-item {
  min-width: 300px;
  margin-right: 2em;
}
</style>
