import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";

export class LoasLitispendencia {
    async handle(parginaDosPrevFormatada: any):Promise<any>{

        let inicioLitis = 2;
        let tamanhoColunaLitis = 0;
        ///html/body/div/div[2]
        ///html/body/div/div[2]/table/tbody
        let verificarWhileLitis = true;
        while (verificarWhileLitis) {
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[2]/table/tbody/tr[${inicioLitis}]`)) == 'object'){
                verificarWhileLitis = false; 
                break;
            }
            inicioLitis++;
            tamanhoColunaLitis++;
        }
        console.log('---COLUNA LIST: ' + tamanhoColunaLitis)

        const objetosEncontradosParaVerificar = []
        for (let t = 1; t < tamanhoColunaLitis; t++) {
            if (typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[2]/table/tbody/tr[${t}]`)) === 'string') {
                    const restabelecimento = {
                        beneficio: "qualquerEspecie",
                    }
                    objetosEncontradosParaVerificar.push(restabelecimento)
            }
        }

        console.log(objetosEncontradosParaVerificar)

        if (objetosEncontradosParaVerificar.length < 2) {
            return false
        } else {
            return true
        }         
    }
    
}

    
    