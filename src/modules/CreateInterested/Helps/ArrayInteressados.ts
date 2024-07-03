interface Record {
    pessoa: {
        numeroDocumentoPrincipal: string;
    }
}

interface Result {
    records: Record[];
}

interface InputObject {
    result: Result;
}

type InputArray = InputObject[];


export function arrayInteressados(inputArray: InputArray): string[] {

    if (inputArray.length === 0 || typeof inputArray[0] !== 'object') {
        throw new Error("O array de entrada deve conter um único objeto.");
    }

    const objeto = inputArray[0];
    const resultado: string[] = ['0000000000-'];

    if (objeto.result && Array.isArray(objeto.result.records)) {
        for (let i = 0; i < objeto.result.records.length; i++) {
            if (objeto.result.records[i].pessoa.numeroDocumentoPrincipal) {
                resultado.push(objeto.result.records[i].pessoa.numeroDocumentoPrincipal);
            }
        }
    } else {
        throw new Error("O caminho objeto.result.records não existe ou não é um array.");
    }

    return resultado;
    
}