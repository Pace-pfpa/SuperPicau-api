export function ordenarDatas(str: string): string | boolean {
  try{

    const regex = /(?<=\s)(\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{4})(?=\s)/g; // regex para buscar datas no formato DD/MM/YYYY ou MM/YYYY
    const dates: string[] = [];
  
    let match;
    while ((match = regex.exec(str))) {
      dates.push(match[1]); // Adiciona apenas o grupo relevante (a data encontrada) ao array
    }
  
    const normalizedDates = dates.map(date => {
      if (date.length === 7) { // Formato "MM/YYYY"
        return `01/${date}`;
      }
      return date; // Mantém "DD/MM/YYYY" como está
    });
  
    normalizedDates.sort((a, b) => {
      const dateA = new Date(a.replace('/', '-'));
      const dateB = new Date(b.replace('/', '-'));
      return dateA.getTime() - dateB.getTime(); // Ordena as datas em ordem crescente
    });

    const result = normalizedDates.join(',');

    return result;
  }catch(e){
    console.error('previdenciarias sem data fim')
    return false
  }    
}
