import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";

export class LoasLitispendenciaSuperDossie{
    async handle(parginaDosPrevFormatada: any):Promise<any>{
        //Estrutura para identificar a maior data, e fazer a subtração dela
        ///html/body/div/div[5]

        let tamanhoColunaLitis = 1;
        // /html/body/div/div[5]/table/tbody/tr[1]
        let verificarWhileLitis = true;
        while (verificarWhileLitis) {
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[5]/table/tbody/tr[${tamanhoColunaLitis}]`)) == 'object'){
                verificarWhileLitis = false; 
                break;
            }
            tamanhoColunaLitis++;
        }

        const objetosEncontradosParaVerificar = []
        for (let t = 1; t < tamanhoColunaLitis; t++) {
            if (typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[5]/table/tbody/tr[${t}]`)) === 'string') {
                    const restabelecimento = {
                        beneficio: "qualquerEspecie",
                    }
                    objetosEncontradosParaVerificar.push(restabelecimento)
            }
        }

        if (objetosEncontradosParaVerificar.length < 2) {
            return false
        } else {
            return true
        }         
    }
    
}

    
    