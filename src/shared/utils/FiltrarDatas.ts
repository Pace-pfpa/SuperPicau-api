import moment from 'moment';

export function extractDatesFromString(text: string): Date[] {
    const dateRegex = /\d{2}\/\d{2}\/\d{4}/g; // Expressão regular para encontrar datas no formato dd/mm/aaaa
    const matches = text.match(dateRegex); // Retorna um array com todas as datas encontradas no texto
    const date = moment(matches, 'DD/MM/YYYY').toDate();
    //console.log(matches)
    if (date) {
      return [date];  // Converte cada data em um objeto Date e retorna um array de datas
    } else {
      return []; // Se não houver datas, retorna um array vazio
    }
  }