<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-toolbar flat dense color="white">
            <v-toolbar-title>Серверы</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn fab small color="primary" @click="showAddServerForm = true">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <dynamic-form
            :title="serverForm.title"
            :fields="serverForm.fields"
            :visible="showAddServerForm"
            @submit="addServer"
            @cancel="handleCancel"
          ></dynamic-form>
          <v-list two-line dense>
            <v-list-item
              v-for="server in servers"
              :key="server.name"
              @click="fetchStorages(server)"
            >
              <div class="d-flex align-center justify-space-between w-100">
                <v-list-item>
                  <v-list-item-title>{{ server.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ server.url }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item-action>
                  <v-btn icon small color="primary">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small color="red">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-toolbar flat dense color="white">
            <v-toolbar-title>Хранилища</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn fab small color="primary" @click="showAddStorageForm = true">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <dynamic-form
            :title="storageForm.title"
            :fields="storageForm.fields"
            :visible="showAddStorageForm"
            @submit="addStorage"
            @cancel="handleCancel"
          ></dynamic-form>
          <v-list two-line dense>
            <v-list-item v-for="storage in storages" :key="storage.id">
              <div class="d-flex align-center justify-space-between w-100">
                <v-list-item>
                  <v-list-item-title>Имя: {{ storage.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >Путь: {{ storage.path }}</v-list-item-subtitle
                  >
                </v-list-item>
                <v-list-item-action>
                  <v-btn icon small color="primary">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small color="red">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  serverFormConfig,
  storageFormConfig,
} from "./../form_config/storage_forms";
import { useServers } from "./useServers";
import DynamicForm from "./../components/DynamicForm.vue";

const { servers, storages, fetchStorages } = useServers();

const showAddServerForm = ref(false);
const showAddStorageForm = ref(false);

const serverForm = ref({ ...serverFormConfig, submit: addServer });
const storageForm = ref({ ...storageFormConfig, submit: addStorage });

function addServer() {
  // Логика добавления сервера
}

function addStorage() {
  // Логика добавления хранилища
}

function handleCancel() {
  showAddServerForm.value = false;
  showAddStorageForm.value = false;
}
</script>

<style scoped>
@media (min-width: 600px) {
  .v-list-item-action.mobile {
    display: none;
  }
}

@media (max-width: 599px) {
  .v-list-item-action.desktop {
    display: none;
  }

  .v-list-item-action.mobile {
    display: block;
  }
}

.list-item-action {
  display: flex;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.v-btn--icon.v-btn--density-default {
  width: var(--v-btn-height);
  height: var(--v-btn-height);
}
</style>
