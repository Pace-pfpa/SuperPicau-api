import { ta } from "date-fns/locale";
import { getXPathText } from "../../../../helps/GetTextoPorXPATH";

export class CadUnico{


///html/body/div[7]/table/tbody/tr[1]
    async execute(paginaCadUnico: any){
        let valorMedicamentoTable = null;
        const procurarporTabelaCorretaDiv = 15;
        const procrurarPorTabelaCorretaTable = 15;
        for(let i = 1; i <= procurarporTabelaCorretaDiv; i++){
            const xpathtable = `/html/body/div[${i}]/table`
            const table = getXPathText(paginaCadUnico, xpathtable);
            if(table && table.length > 0){
                for(let j = 1; j <= 40; j++){
                    const xpathTaline = `/html/body/div[6]/table/tbody/tr[${j}]`
                    const linha = getXPathText(paginaCadUnico, xpathTaline);

                    if(linha && linha.length > 0){
                        const campoMicamentosExiste = linha.indexOf("medicamentos");
                        const campoDespesaExiste =  linha.indexOf("despesas");
                        if(campoMicamentosExiste != -1 && campoDespesaExiste != -1){
                            
                            const valorMedicamento = linha.split(":")[1].replace(",",".")
                            valorMedicamentoTable = valorMedicamento
                            return valorMedicamentoTable.trim();
                        }
                    }
                }



            } 
        }

       
        for(let i = 1; i <= procurarporTabelaCorretaDiv; i++){
            for(let j = 1; j < procrurarPorTabelaCorretaTable; j++){
                const xpathTables = `/html/body/div[${i}]/table[${j}]`;
                const tables = getXPathText(paginaCadUnico, xpathTables);

                if(tables && tables.length > 0){
                    for(let k = 0; k < 40; k++){
                        const xpathLine = `/html/body/div[${i}]/table[${j}]/tbody/tr[${k}]`
                        const lines = getXPathText(paginaCadUnico, xpathLine);

                        if(lines && lines.length > 0){
                            const campoMicamentosExiste = lines.indexOf("medicamentos");
                            const campoDespesaExiste =  lines.indexOf("despesas");

                            if(campoMicamentosExiste != -1 && campoDespesaExiste != -1){
                                const valorMedicamento = lines.split(":")[1].replace(",",".")
                                valorMedicamentoTable = valorMedicamento
                                return valorMedicamentoTable.trim();
                            }

                        }

                    }


                }
            }


        }
        


        return null;








        
    }





}