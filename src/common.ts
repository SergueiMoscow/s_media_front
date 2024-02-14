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
