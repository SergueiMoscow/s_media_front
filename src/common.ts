import apiClient from "./apiClient";
import { FileObject } from "./types";

export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const day = zeroPad(date.getDate());
    const month = zeroPad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = zeroPad(date.getHours());
    const minutes = zeroPad(date.getMinutes());
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function zeroPad(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
}

export async function getAvailableTags(server_id: string, files?: FileObject[]){
    if (!server_id) {
        return []
    }
    const response_tags = await apiClient.get(
            `/catalog/tags/${server_id}/`
        );
        const result = response_tags?.data.results;


    if(files){ // only process if files are provided
        // Extract all tags from files and remove duplicates
        let fileTags = files.reduce((tags: string[], file: FileObject) => {
            return [...tags, ...file.tags];
        }, []);

        fileTags = [...new Set(fileTags)]; // remove duplicates
        // Add unique tags from files to the result
        fileTags.forEach(tag => {
          if(!result.includes(tag)) {
            result.push(tag);
          }
        });
    }

    return result;
}
