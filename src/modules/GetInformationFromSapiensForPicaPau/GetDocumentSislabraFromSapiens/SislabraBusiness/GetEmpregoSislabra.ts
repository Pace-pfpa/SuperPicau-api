import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
import { Emprego } from "../../dto";

export async function getEmpregoSislabra(paginaSislabra: JSDOMType): Promise<Emprego[]> {
    const empregosEncontrados: Emprego[] = [];
    let contadorWhile = true;
    let contadorXpath = 2;
    while(contadorWhile){
        const salarioContradoXpath = getXPathText(paginaSislabra, `html/body/div/main/div/div[8]/table/tbody/tr[${contadorXpath}]/td[8]`)
        const ocupacao = getXPathText(paginaSislabra, `html/body/div/main/div/div[8]/table/tbody/tr[${contadorXpath}]/td[5]`)
        const empresa = getXPathText(paginaSislabra, `html/body/div/main/div/div[8]/table/tbody/tr[${contadorXpath}]/td[3]`)
       
        if(!salarioContradoXpath){
            break;
        }

        const salarioSemVirgulaEPonto = parseInt(salarioContradoXpath.split(",")[0].replace(".",""))
        if(salarioSemVirgulaEPonto > 3000){
            empregosEncontrados.push({
                salarioContrato: `${salarioContradoXpath}`,
                ocupacao: ocupacao ? `${ocupacao}` : "OCUPAÇÃO NÃO ENCONTRADA",
                empresa: empresa ? `${empresa}` : "EMPRESA NÃO ENCONTRADA",
              });
        }
            
    
        contadorXpath += 1;

        if (contadorXpath > 10) {
            console.log('Máximo de tentativas alcançado (Emprego Sislabra)')
            break;
        }
    }

    const uniqueArray = empregosEncontrados.filter((value, index, self) =>
        index === self.findIndex((obj) => 
            obj.empresa === value.empresa && 
            obj.ocupacao === value.ocupacao && 
            obj.salarioContrato === value.salarioContrato
        )
    );

    return uniqueArray;
}
