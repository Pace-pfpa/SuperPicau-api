import { ta } from "date-fns/locale";
import { getXPathText } from "../../../../helps/GetTextoPorXPATH";
import { CorrigirCpfComZeros } from "../../../CreateInterested/Helps/CorrigirCpfComZeros";

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


    async grupoFamiliar (paginaCadUnico: any, cpfCapa: string) {
        console.log(cpfCapa)
        const armazenamentoDeCpf = [];
        const procurarporTabelaCorretaDiv = 15;
        for(let i = 1; i <= procurarporTabelaCorretaDiv; i++){
            const xpathtable = `/html/body/table[${i}]/tbody`
            const table = getXPathText(paginaCadUnico, xpathtable);
            if(table && table.length > 0){
                for(let j = 1; j <= 40; j++){
                    const xpathTaline = `/html/body/table[2]/tbody/tr[${j}]/td[4]`
                    const cpf = getXPathText(paginaCadUnico, xpathTaline);

                    if (!cpf) {
                        break
                    }
                    
                    const cpfFormatado = CorrigirCpfComZeros(cpf)
                    

                   if(cpfFormatado && cpfFormatado.length > 0 && cpfFormatado !== cpfCapa){
                    armazenamentoDeCpf.push(cpfFormatado)
                   }
                        
                    
                }


            }
            return  armazenamentoDeCpf
        }
       
       
        


        return null;
    }





}