<template>
  <div class="search-container">
    <div class="search-item">
      <v-text-field
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
      <v-menu v-model="menu" :close-on-content-click="false" location="end">
        <v-card min-width="300">
          <v-list>
            <v-list-item
              base-color="primary"
              title="Фильтр"
              prepend-icon="mdi-filter"
            ></v-list-item>
            <v-list-item>
              <Multiselect
                mode="tags"
                placeholder="Поиск по тегам"
                :searchable="true"
                :createTag="true"
                :caret="false"
              />
            </v-list-item>
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
              v-model="filterByDate"
              color="primary"
              label="Фильтр по дате"
              hide-details
            ></v-switch>
          </v-list-item>
            <v-list-item v-if="filterByDate">
              Дата от
              <input type="date" id="start" name="search-end" value="2023-05-03">
            </v-list-item>
            <v-list-item v-if="filterByDate">
              Дата до
              <input type="date" id="start" name="search-end" value="2023-05-03">
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
            <v-btn color="primary" variant="text" @click="menu = false">
              Поиск
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
// https://vuetifyjs.com/en/components/menus/#activator-and-tooltip
import { ref } from "vue";
import Multiselect from "@vueform/multiselect";
let loading = ref(false)
let menu = ref(false);
let filterByDate = ref(false)
let selectPublished = "Все";
let orderField = 'created_at'
let orderDirection = 'desc'
let itemsOrderField = [
  {
    title: 'Дата',
    value: 'created_at',
  },
  {
    title: 'Описание',
    value: 'note',
  }
]
let itemsOrderDirection = [
  {
    title: 'По возрастанию',
    value: 'asc',
  },
  {
    title: 'По убыванию',
    value: 'desc',
  },
]
let itemsPublished = [
  {
    title: 'Все',
    value: 'all',
  },
  {
    title: 'Опубликованные',
    value: 'public',
  },
  {
    title: 'Неопубликованные',
    value: 'private',
  },
]

const activateMenu = () => {
  menu.value = true;
};
const onSearchClick = () => {}

</script>

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
