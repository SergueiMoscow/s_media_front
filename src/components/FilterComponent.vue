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
        <!-- <template v-slot:activator="{ props }">
          <v-btn color="white" v-bind="props">
            <v-icon dark>mdi-menu</v-icon>
          </v-btn>
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
        </template> -->

        <v-card min-width="300">
          <v-list>
            <v-list-item
              prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
              subtitle="Founder of Vuetify"
              title="John Leider"
            >
              <template v-slot:append>
                <v-btn
                  :class="fav ? 'text-red' : ''"
                  icon="mdi-heart"
                  variant="text"
                  @click="fav = !fav"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-switch
                v-model="message"
                color="purple"
                label="Enable messages"
                hide-details
              ></v-switch>
            </v-list-item>

            <v-list-item>
              <v-switch
                v-model="hints"
                color="purple"
                label="Enable hints"
                hide-details
              ></v-switch>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn variant="text" @click="menu = false"> Cancel </v-btn>
            <v-btn color="primary" variant="text" @click="menu = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script setup>
// https://vuetifyjs.com/en/components/menus/#activator-and-tooltip
import { ref } from "vue";

let fav = true;
let menu = ref(false);
let message = false;
let hints = true;
let on = false;

const activateMenu = () => {
  menu.value = true;
};
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
