import apiClient from "@/apiClient";
import { Folder } from "@/types";

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
        folder.name
    );
    const collageImage = arrayBufferToBase64(collageBytesArray);
    const collageUrl = `data:image/jpeg;base64,${collageImage}`;

    return {
        ...folder,
        image_url: `${import.meta.env.VITE_BACKEND_URL
            }/folders_image?folders=${folder.folders_count.direct
            }&timestamp=${new Date().getTime()}&rand=${Math.random()}`,
        collage_url: collageUrl, // Здесь вы будете использовать полученный URL в качестве значения
    };
}
