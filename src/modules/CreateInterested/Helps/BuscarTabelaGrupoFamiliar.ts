import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";

export class BuscarTabelaGrupoFamiliar{

    
    
    async execute(paginaCadUnico: JSDOMType){
        const armazenamentoDeCpf = [];
        const procurarporTabelaCorretaDiv = 15;
        for(let i = 1; i <= procurarporTabelaCorretaDiv; i++){
            const xpathtable = `/html/body/table[${i}]/tbody`
            const table = getXPathText(paginaCadUnico, xpathtable);
            if(table && table.length > 0){
                for(let j = 1; j <= 40; j++){
                    const xpathTaline = `/html/body/table[2]/tbody/tr[${j}]/td[4]`
                    const cpf = getXPathText(paginaCadUnico, xpathTaline);
                    

                   if(cpf && cpf.length > 0){
                    armazenamentoDeCpf.push(cpf)
                   }
                        
                    
                }


            }
            return  armazenamentoDeCpf
        }
       
       
        


        return null;








        
    }










}