import { getXPathText } from "../../../../helps/GetTextoPorXPATH";

export async function getImoveis(paginaSislabra: string): Promise<boolean>{
    let whileValue = true;
    let contadorwhile = 2;
    while(whileValue){
        ///html/body/div/main/div/div[2]/table/tbody/tr[2]/td[6]
        ///html/body/div/main/div/div[2]/table/tbody/tr[3]/td[6]
        const imovelSp = getXPathText(paginaSislabra, `html/body/div/main/div/div[2]/table/tbody/tr[${contadorwhile}]/td[6]`)
        
        if(!imovelSp){
            return false
        }

        if(imovelSp.trim() == "SP"){
            return true
        }
        contadorwhile = contadorwhile + 1;
    }

}