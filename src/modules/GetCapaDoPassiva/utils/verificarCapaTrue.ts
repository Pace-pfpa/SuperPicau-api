import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { JSDOM } from 'jsdom';

export async function verificarCapaTrue(capaToVerivy: JSDOM){ 

    for(let i=0; i<10;i++){
        let pathDivTable = `/html/body/div/div[${i}]`;
        let infoxPath = getXPathText(capaToVerivy, pathDivTable);

        if(infoxPath){
            for(let j=0;j<20; j++){
                let xpathDivLinha = `html/body/div/div[${i}]/table/tbody/tr[${j}]/td[1]`
                let infoXptahLinha = getXPathText(capaToVerivy, xpathDivLinha);
                if(infoXptahLinha){
                    if("Classe:" == infoXptahLinha){
                        return true;
                    }
                }
                

            }
        }

    }
    return false;
}