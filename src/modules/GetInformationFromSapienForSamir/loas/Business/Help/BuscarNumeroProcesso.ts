import { EncontrarDataMaisAtual } from "./EncontrarDataMaisAtual";

export function buscaNumeroProcesso(text) {
    
    const numberRegex = /\b\d{20}\b/

   
    const number = text.match(numberRegex);

    
    if (number) {   
        return number[0]; 
    } else {
        console.log(number)
        return false
    }
}

