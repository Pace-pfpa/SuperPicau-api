export function findDatesInString(datesStr: string): string[] {
    // Criar uma expressão regular para encontrar todas as datas no formato mm/aaaa
    const regex = /\b(0[1-9]|1[0-2])\/\d{4}\b/g;
    
    // Usar o método match para encontrar todas as ocorrências que correspondem ao regex
    const matches = datesStr.match(regex);
    
    // Se não houver correspondências, retornar um array vazio
    return matches ? matches : [];
}