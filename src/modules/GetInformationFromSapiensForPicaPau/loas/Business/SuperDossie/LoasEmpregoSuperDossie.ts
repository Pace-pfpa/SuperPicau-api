//iniciar a logica de buscar o emprego
//primeiro buscar a data no ajuizamento
//depois buscar a data nos requerimentos
//depois buscar a data das previdenciarias
//fazer comparacoes e tratar os erros possiveis

import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { convertToDate } from "../../../helps/createFormatDate";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { EncontrarDataMaisAtual } from "../Help/EncontrarDataMaisAtual";
import { buscarDataParaLoasEmprego } from "../Help/buscarDataParaLoasEmprego";



//organizar xpath para super dossies
export class LoasEmpregoSuperDossie{
    async execute(parginaDosPrevFormatada: any){
        
        try{

            const xpathDataAjuzamento = "/html/body/div/div[4]/table/tbody/tr[2]/td"
            const dateAjuizamento = getXPathText(parginaDosPrevFormatada, xpathDataAjuzamento);
    
            if(!dateAjuizamento) new Error("data ajuizamento não encontrada");
            if(dateAjuizamento.length == 0) new Error("data ajuizamento não encontrada");
            if(!(typeof(convertToDate(dateAjuizamento.trim())) == typeof(new Date()))) new Error("pegou xpath errado do ajuizamento");


            let tamanhoColunasRequerimentos = 1;
            const arrayDatas: Array<Date> = [];
            let verificarWhileRequerimentos = true;
            while(verificarWhileRequerimentos){
                if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                    verificarWhileRequerimentos = false; 
                    break;
                }
                tamanhoColunasRequerimentos++;
            }

            const objetosEncontradosParaVerificar = []
            for(let t=2; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);

                    if(xpathCoulaFormatadoRequerimentos.indexOf("ATIVO") !== -1){
                        return {
                            valorBooleano: true,
                            message: " ATIVO LOAS EMPREGO -"
                        }
                    }
                        if(xpathCoulaFormatadoRequerimentos.indexOf("87 - ") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("88 - ") !== -1){
                                const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "beneficioQualquerStatusMenosAtivo",
                                    data: convertToDate(buscarDataCessaoOuSuspenso[0])
                                }
                                objetosEncontradosParaVerificar.push(restabelecimento)

                           const datasEncontradas = (buscardatasLoas(xpathCoulaFormatadoRequerimentos))
                        }
                      
                }
            }
            
           

            if(objetosEncontradosParaVerificar.length == 0) return false
            


            const dataMaisAtualRequerimentos = EncontrarDataMaisAtual(objetosEncontradosParaVerificar)
            
            let dataInicial: any = "";
            let dataFinal: any = "";
            if(dataMaisAtualRequerimentos.data >= convertToDate(dateAjuizamento.trim())){
                dataFinal = dataMaisAtualRequerimentos.data
                dataInicial = convertToDate(dateAjuizamento)
            }else if(convertToDate(dateAjuizamento.trim()) >= dataMaisAtualRequerimentos.data){
                dataFinal = convertToDate(dateAjuizamento)
                dataInicial = dataMaisAtualRequerimentos.data
            }else{
                throw new Error("ERRO AO PEGAR A DATA MAIS ATUAL")
            }


            //buscar os dados agora ta tabela das "RELACOES PREVIDENCIARIAS"


            let tamanhoColunaPrevidenciarias = 1;
            let verificarWhilePrevidenciarias = true;
            while(verificarWhilePrevidenciarias){
                if(typeof (getXPathText(parginaDosPrevFormatada, `html/body/div/div[7]/table/tbody/tr[${tamanhoColunaPrevidenciarias}]`)) == 'object'){
                    verificarWhilePrevidenciarias = false; 
                    break;
                }
                tamanhoColunaPrevidenciarias++;
            }
            
            // /html/body/div/div[7]/table/tbody/tr[1]/td[5]
            // /html/body/div/div[7]/table/tbody/tr[2]/td[5]
            // /html/body/div/div[8]/table/tbody/tr[1]/td[5]
            // /html/body/div/div[7]
            let dataInicioPrevidenciariasNaoExiste = false;
            let dataFimPrevidenciariasNaoExiste = false;
            let dataInicioEDataFimNaoExistem = false;
            for(let i = 1; i<tamanhoColunaPrevidenciarias; i++){
                const xpathDataInicioPrevidenciarias = `/html/body/div/div[7]/table/tbody/tr[${i}]/td[5]`
                const xpathDataFimPrevidenciarias = `/html/body/div/div[7]/table/tbody/tr[${i}]/td[6]`
                
                const dataInicioPrevidenciaria = getXPathText(parginaDosPrevFormatada, xpathDataInicioPrevidenciarias);
                const dataFimPrevidenciaria = getXPathText(parginaDosPrevFormatada, xpathDataFimPrevidenciarias);

                console.log('----DATA INICIO PREVIDENCIARIA: ')
                console.log(dataInicioPrevidenciaria)

                if(dataInicioPrevidenciaria.trim().length == 0 && dataFimPrevidenciaria.trim().length == 0){
                    dataInicioEDataFimNaoExistem = true;
                    continue;
                }

                
                if(dataInicioPrevidenciaria && dataFimPrevidenciaria.trim().length == 0){
                    if(buscarDataParaLoasEmprego(dataInicial, dataFinal, convertToDate(dataInicioPrevidenciaria.trim()), null)){
                        return true;
                    }
                    dataFimPrevidenciariasNaoExiste = true;
                    continue;
                }

                if(dataInicioPrevidenciaria.trim().length == 0 && dataFimPrevidenciaria){
                    if(buscarDataParaLoasEmprego(dataInicial, dataFinal, null, convertToDate(dataFimPrevidenciaria.trim()))){
                        return true;
                    }
                    dataInicioPrevidenciariasNaoExiste = true;
                    continue;
                }
            }

            if(dataInicioPrevidenciariasNaoExiste || dataFimPrevidenciariasNaoExiste || dataInicioEDataFimNaoExistem){
                return {
                    valorBooleano: false,
                    message: " Verificar datas nas RELAÇÕES PREVIDENCIÁRIAS -"
                }
            }

            return false;

        }catch(e){
            console.log("ERRO EMPREGO LOAS" + e)
            return e
        }





    }
}