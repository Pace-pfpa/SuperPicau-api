/**
 * Função auxiliar para converter uma string no formato "DD/MM/AAAA" em um objeto Date.
 */
export function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
}