export function formatDate(dateString: string): string {
    // Cria um objeto Date a partir da string
    const date = new Date(dateString);
  
    // Pega o dia, mês e ano da data
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0
    const year = date.getFullYear();
  
    // Retorna a data formatada como dd/mm/aaaa
    return `${day}/${month}/${year}`;
}