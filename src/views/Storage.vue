<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-toolbar flat dense color="white">
            <v-toolbar-title>Серверы</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn fab small color="primary" @click="showAddServerForm()">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <dynamic-form
            :id="serverForm?.id"
            :title="serverForm?.title"
            :fields="serverForm?.fields"
            :visible="isVisibleServerForm"
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
                  <v-btn icon small color="primary" @click="showEditServerForm(server)">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small color="red" @click="deleteServer(server)">
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
            <v-btn fab small color="primary" @click="showAddStorageForm()">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <dynamic-form
            :id="storageForm?.id"
            :title="storageForm?.title"
            :fields="storageForm?.fields"
            :visible="isVisibleStorageForm"
            @submit="addStorage"
            @cancel="handleCancel"
          ></dynamic-form>
          <v-list two-line dense>
            <v-list-item v-for="storage in storages" :key="storage.id">
              <div class="d-flex align-center justify-space-between w-100">
                <v-list-item>
                  <v-list-item-title>Имя: {{ storage.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >Путь: {{ storage.path }}, id:{{ storage.server_id }}</v-list-item-subtitle
                  >
                </v-list-item>
                <v-list-item-action>
                  <v-btn icon small color="primary" @click="showEditStorageForm(storage)">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small color="red" @click="deleteStorage(storage)">
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
import { ref, reactive } from "vue";
import {
  serverFormConfig,
  storageFormConfig,
} from "./../form_config/storage_forms";
import { useServers } from "./useServers";
import DynamicForm from "./../components/DynamicForm.vue";
import apiClient from "@/apiClient";
import { Server, Storage, Option } from "@/types"

const { servers, storages, currentServer, fetchStorages, fetchServers } = useServers();
let serverForm = reactive({ ...serverFormConfig, submit: addServer }); // Инициализируем как null.
let storageForm = reactive({ ...storageFormConfig, submit: addStorage }); // Инициализируем как null.

const isVisibleServerForm = ref(false);
const isVisibleStorageForm = ref(false);

async function addServer(id: Number, formData: Server) {
  if (id == 0) {
    await apiClient.post('/servers/', formData)
  } else {
    await apiClient.patch(`/servers/${id}/`, formData)
  }
  fetchServers()
}

async function addStorage(id: String, formData: Storage) {
  if (id === '') {
    await apiClient.post('/storages/', formData)
  } else {
    await apiClient.patch(`/storages/${id}/`, formData)
  } 
}

function handleCancel() {
  isVisibleServerForm.value = false;
  isVisibleStorageForm.value = false;
}

async function deleteServer(server: Server) {
  await apiClient.delete(`/servers/${server.id}/`)
  fetchServers()
}

async function deleteStorage(storage: Storage) {
  await apiClient.delete(`/storages/${currentServer.value}/${storage.id}/`)
  fetchServers()
}


function showEditServerForm(server: Server) {
  serverForm.fields.name.value = server.name
  serverForm.fields.url.value = server.url
  serverForm.id = parseInt(server.id)
  serverForm.title = `Сервер ${server.name} (${server.id})`
  isVisibleServerForm.value = true;
}

function showAddServerForm() {
  serverForm.fields.name.value = ''
  serverForm.fields.url.value = ''
  serverForm.id = 0
  serverForm.title = `Добавить сервер`
  isVisibleServerForm.value = true;
}

function updateServerList(): Option[] {
  const result: Option[] = []
  servers.value.forEach(server => {
    result.push({value: server.id, title: server.name})
  })
  return result
}

function showAddStorageForm() {
  storageForm.fields.name.value = 'a'
  storageForm.fields.path.value = 'b'
  storageForm.fields.server_id.values_list = updateServerList()
  storageForm.title = `Добавить хранилище`
  storageForm.id = '';
  isVisibleStorageForm.value = true;
}

function showEditStorageForm(storage: Storage) {
  storageForm.fields.name.value = storage.name
  storageForm.fields.path.value = storage.path
  storageForm.fields.server_id.value = storage.server_id
  storageForm.title = `Хранилище ${storage.name} (${storage.id}})`
  storageForm.id = storage.id;
  isVisibleStorageForm.value = true;
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
