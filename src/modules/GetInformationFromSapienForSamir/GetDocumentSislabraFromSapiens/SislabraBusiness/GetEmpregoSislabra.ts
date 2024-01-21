import { getXPathText } from "../../../../helps/GetTextoPorXPATH";

export async function getEmpregoSislabra(paginaSislabra: string){
    ///html/body/div/main/div/div[8]/table/tbody/tr[2]/td[8]
    ///html/body/div/main/div/div[8]/table/tbody/tr[3]/td[8]
    let contadorWhile = true;
    let contadorXpath = 2;
    while(contadorWhile){
        const salarioContradoXpath = getXPathText(paginaSislabra, `html/body/div/main/div/div[8]/table/tbody/tr[${contadorXpath}]/td[8]`)
        const ocupacao = getXPathText(paginaSislabra, `html/body/div/main/div/div[8]/table/tbody/tr[${contadorXpath}]/td[5]`)
       
        if(!salarioContradoXpath){
            return false;
        }

        if(salarioContradoXpath){
            const salarioSemVirgulaEPonto = parseInt(salarioContradoXpath.split(",")[0].replace(".",""))
            if(salarioSemVirgulaEPonto > 3000){
                if(ocupacao){
                    return {
                        "salarioContrato": `${salarioSemVirgulaEPonto}`,
                        "ocupacao": `${ocupacao}`
                    }
                }else{
                    return {
                        "salarioContrato": `${salarioSemVirgulaEPonto}`,
                        "ocupacao": `OCUPAÇAO NÃO ENCONTRADA`
                    }
                }
            }
            
        }
        contadorXpath = contadorXpath + 1
        
    }
}

