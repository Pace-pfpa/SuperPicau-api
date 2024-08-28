export function parseDate(dateString: string): Date {
    const parts = dateString.split('/')

    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    } else if (parts.length === 2) {
        const month = parseInt(parts[0], 10) - 1;
        const year = parseInt(parts[1], 10);
        return new Date(year, month, 1);
    } else {
        throw new Error('Formato de data inválido');
    }
}