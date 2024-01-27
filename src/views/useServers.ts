import { ref, onMounted, Ref } from 'vue';
import apiClient from './../apiClient';
import { Server, Storage } from './../types'

export function useServers() {
  const servers: Ref<Server[]> = ref([]);
  const storages: Ref<Storage[]> = ref([]);

  async function fetchServers() {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await apiClient.get('/servers/', { headers });
      servers.value = response.data.results;
    } catch (error) {
      console.error("Ошибка при получении серверов:", error);
    }
  }

  async function fetchStorages(server: Server) {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await apiClient.get(`${server.url}/storages`, { headers });
      storages.value = response.data.results;
    } catch (error) {
      console.error("Ошибка при получении хранилищ:", error);
    }
  }

  onMounted(fetchServers);

  return {
    servers,
    storages,
    fetchServers,
    fetchStorages
  };
}
