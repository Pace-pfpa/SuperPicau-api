export function removeDayMonthFromDate(dateStr: string): string {
    // Dividir a string da data em partes usando o caractere '/'
    const dateParts = dateStr.split('/');

    // Verificar se a data está no formato correto
    if (dateParts.length !== 3) {
        throw new Error('Data no formato incorreto. Use o formato dd/mm/aaaa.');
    }

    // Retornar a data sem a parte do dia e mes
    return `${dateParts[2]}`;
}