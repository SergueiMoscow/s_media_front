import apiClient from "@/apiClient";
import { RequestPrams, Folder, PreparedRequestPrams } from "@/types";

export const loadCollage = async (
    server_id: String,
    storage_id: String,
    folder: String
) => {
    const url = `${import.meta.env.VITE_BACKEND_URL
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


export const processFolder = async (folder: Folder, params: any) => {
    folder.path = params.folder_path + '/' + folder.name
    let serverId;
    if (folder.server_id != null) { // Проверяем, существует ли server_id в объекте folder
        serverId = folder.server_id.toString();
    } else if (params && params.server && parseInt(params.server) > 0) { // Проверяем, валиден ли params.server и больше ли он нуля
        serverId = params.server.toString();
    } else {
        throw new Error('No valid server_id provided.');
    }

    let storageId;
    if (folder.storage_id != null) { // Проверяем, существует ли server_id в объекте folder
        storageId = folder.storage_id;
    } else if (params && params.server && parseInt(params.server) > 0) { // Проверяем, валиден ли params.server и больше ли он нуля
        storageId = params.storage;
    } else {
        throw new Error('No valid server_id provided.');
    }

    // Здесь выполняем функцию loadCollage для каждой папки
    const collageBytesArray = await loadCollage(
        serverId,
        storageId,
        folder.path
    );
    const collageImage = arrayBufferToBase64(collageBytesArray);
    const collageUrl = `data:image/jpeg;base64,${collageImage}`;

    return {
        ...folder,
        image_url: `${import.meta.env.VITE_BACKEND_URL
            }/folders_image?folders=${folder.folders_count.direct
            }&timestamp=${new Date().getTime()}&rand=${Math.random()}`,
        collage_url: collageUrl,
    };
}


export const prepareRequestParams = (input: RequestPrams): Partial<PreparedRequestPrams> => {
    const output: Partial<PreparedRequestPrams> = {
      ...input, // start with all properties
      tags: input.tags.join(', '), // convert tags array to string
    };
  
    if (!input.date_filter) {
      delete output.date_from;
      delete output.date_to;
    } else {
      // проверить даты и установить значение по умолчанию при необходимости
      const dateRegEx = /\d{4}-\d{2}-\d{2}/;
      if (!dateRegEx.test(input.date_from)) {
        output.date_from = '1900-01-01';
      }
      if (!dateRegEx.test(input.date_to)) {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        output.date_to = formattedDate;
      }
    }
  
    if (input.public === null) {
      delete output.public;
    }
  
    if (!input.sort) {
      delete output.sort;
    }
  
    if (!input.sort_direction) {
      delete output.sort_direction;
    }
  
    return output;
  }