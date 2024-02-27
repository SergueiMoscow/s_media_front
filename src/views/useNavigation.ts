// import { useRouter } from "vue-router";

import router from "@/router";

export const  navigateToFolder = (server_id: number, storage_id: string, folder_path: string) => {
    // const router = useRouter();

    router.push({
      name: "FolderContent",
      params: {
        server: server_id,
        storage: storage_id,
        folder_path: folder_path,
      },
    });
  };
