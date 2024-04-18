import { EncontrarDataMaisAtual } from "./EncontrarDataMaisAtual";

export function buscardatasLoas(text) {
    
    const dateRegex = /\d{2}\/\d{2}\/\d{4}/g;

   
    const dates = text.match(dateRegex);

    
    if (dates) {     
        return dates; 
    } else {
        console.log(dates)
        return false
    }
}

