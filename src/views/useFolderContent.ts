import apiClient from "@/apiClient";

export const loadCollage = async (
    server_id: String,
    storage_id: String,
    folder: String
  ) => {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/folder_collage/${server_id}/${storage_id}/?folder=${folder}&timestamp=${new Date().getTime()}&rand=${Math.random()}`;
    const response = await apiClient.get(url, {
      responseType: "arraybuffer",
    });
    console.log(`LoadCollage ${server_id}, ${storage_id}, ${folder}`)
    console.log(`LoadCollage url ${url}`)

    return response.data;
  };


export const arrayBufferToBase64 = (buffer: any) => {
    if (buffer instanceof ArrayBuffer) {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      if (len === 0) {
        console.error("Buffer has no data.");
        return "";
      }
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    } else {
      console.error("The input is not an ArrayBuffer.");
      return "";
    }
  }
