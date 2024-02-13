import { ref, onMounted, Ref } from 'vue';
import apiClient from './../apiClient';
import { Server, Storage } from './../types'

export function useServers() {
  const servers: Ref<Server[]> = ref([]);
  const storages: Ref<Storage[]> = ref([]);
  const currentServer: Ref<Number> = ref(0)

  async function fetchServers() {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await apiClient.get(`/servers/`, { headers });
      servers.value = response.data.results;
    } catch (error) {
      console.error("Ошибка при получении серверов:", error);
    }
  }

  async function fetchStorages(server: Server) {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await apiClient.get(`/storages/?server_id=${server.id}`, { headers });
      currentServer.value = parseInt(server.id)
      storages.value = response.data.results;
    } catch (error) {
      console.error("Ошибка при получении хранилищ:", error);
    }
  }

  onMounted(fetchServers);

  return {
    servers,
    storages,
    currentServer,
    fetchServers,
    fetchStorages
  };
}
