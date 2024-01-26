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
            <v-list-item-group v-model="selectedServerIndex" color="primary">
              <v-list-item
                v-for="(server, index) in servers.results"
                :key="server.name"
                @click="fetchStorages(server)"
              >
                <div class="d-flex align-center justify-space-between w-100">
                  <v-list-item-content>
                    <v-list-item-title>{{ server.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      server.url
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
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
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-toolbar flat dense color="white">
            <v-toolbar-title>Хранилища</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn fab small color="primary" @click="showAddStorageForm=true">
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
            <v-list-item-group>
              <v-list-item v-for="storage in storages" :key="storage.id">
                <div class="d-flex align-center justify-space-between w-100">
                  <v-list-item-content>
                    <v-list-item-title>{{ storage.name }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Путь: {{ storage.path }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
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
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiClient from "./../apiClient";
import { serverFormConfig, storageFormConfig } from './../form_config/storage_forms';
import DynamicForm from './../components/DynamicForm.vue';
const showAddServerForm = ref(false);
const showAddStorageForm = ref(false);


const servers = ref({ results: [] });
const storages = ref([]);
const selectedServerIndex = ref(null);

const serverForm = ref({ ...serverFormConfig });
const storageForm = ref({ ...storageFormConfig });


onMounted(async () => {
  const token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const serverResponse = await apiClient.get(`/servers/`, { headers });
    servers.value = serverResponse.data;

    // Тут можно добавить запрос к API для хранилищ, если он отличается от запроса серверов,
    // и установить стейт storages.value
  } catch (error) {
    console.error("Ошибка при получении серверов или хранилищ:", error);
    // Обработка ошибок, например показ сообщения пользователю
  }
});

async function fetchStorages(server) {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    // const storageResponse = await axios.get(`${server.url}/storages`, { headers });
    const storageResponse = await apiClient.get(`${server.url}/storages`, {
      headers,
    });
    storages.value = storageResponse.data;
  } catch (error) {
    console.error("Ошибка при получении хранилищ:", error);
    // Обработка ошибок
  }
}
function addServer() {
    console.log("Добавить сервер", data);
  // Логика добавления сервера
}
function addStorage() {
    console.log("Добавить хранилище", data);
  // Логика добавления хранилища
}
function handleCancel() {
    showAddServerForm.value = false;
    showAddStorageForm.value = false;
}

serverForm.value.submit = addServer;
storageForm.value.submit = addStorage;

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
