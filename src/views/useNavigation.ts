// import { useRouter } from "vue-router";

import router from "@/router";

export const navigateToFolder = (server_id: string, storage_id: string, folder_path: string, page: number = 1) => {
  console.log(`NavigateToFolder page ${page}`)
  router.push({
    name: "FolderContent",
    params: {
      server: server_id,
      storage: storage_id,
      folder_path: folder_path,
    },
    query: {
      page: page.toString(),
    }
  });
};
