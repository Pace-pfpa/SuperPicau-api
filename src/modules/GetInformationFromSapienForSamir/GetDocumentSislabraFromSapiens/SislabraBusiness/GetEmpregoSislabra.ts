import { Emprego } from "../../../../DTO/IResponseSislabra";
import { getXPathText } from "../../../../helps/GetTextoPorXPATH";

export async function getEmpregoSislabra(paginaSislabra: string): Promise<Emprego[]> {
    const empregosEncontrados: Emprego[] = [];
    let contadorWhile = true;
    let contadorXpath = 2;
    while(contadorWhile){
        console.log("calma pae")
        const salarioContradoXpath = getXPathText(paginaSislabra, `html/body/div/main/div/div[8]/table/tbody/tr[${contadorXpath}]/td[8]`)
        const ocupacao = getXPathText(paginaSislabra, `html/body/div/main/div/div[8]/table/tbody/tr[${contadorXpath}]/td[5]`)
       
        if(!salarioContradoXpath){
            break;
        }

        const salarioSemVirgulaEPonto = parseInt(salarioContradoXpath.split(",")[0].replace(".",""))
        if(salarioSemVirgulaEPonto > 3000){
            empregosEncontrados.push({
                salarioContrato: `${salarioSemVirgulaEPonto}`,
                ocupacao: ocupacao ? `${ocupacao}` : "OCUPAÇÃO NÃO ENCONTRADA",
              });
        }
            
    
        contadorXpath += 1;

        if (contadorXpath > 7) {
            console.log('Máximo de tentativas alcançado (Emprego Sislabra)')
            break;
        }
    }

    return empregosEncontrados;
}
