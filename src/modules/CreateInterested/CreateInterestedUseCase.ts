const { JSDOM } = require('jsdom');
import { IinteressadosDTO } from "../../DTO/InteressadosDTO";
import { loginUseCase } from "../LoginUsuario";
import { getUsuarioUseCase } from "../GetUsuario";
import { getTarefaUseCase } from "../GetTarefa";
import { GetPessoa_id } from "./RequisicaoAxiosTarefas/GetPessoa_id";
import { CreateTarefa } from "./RequisicaoAxiosTarefas/CreateTarefa";
import { GetInteressadosReq } from "./RequisicaoAxiosTarefas/GetInteressadosReq";
import { IGetArvoreDocumentoDTO } from "../../DTO/GetArvoreDocumentoDTO";
import { getArvoreDocumentoUseCase } from "../GetArvoreDocumento";
import { getDocumentoUseCase } from "../GetDocumento";
import { ResponseArvoreDeDocumento } from "../../sapiensOperations/response/ResponseArvoreDeDocumento";
import { BuscarTabelaGrupoFamiliar } from "./Helps/BuscarTabelaGrupoFamiliar";
import { getCapaDoPassivaUseCase } from "../GetCapaDoPassiva";
import { verificarCapaTrue } from "../GetInformationFromSapienForSamir/helps/verificarCapaTrue";
import { getXPathText } from "../../helps/GetTextoPorXPATH";
import { buscarTableCpf } from "../GetInformationFromSapienForSamir/helps/procurarTableCpf";
import { updateEtiquetaUseCase } from "../UpdateEtiqueta";
import { CorrigirCpfComZeros } from "./Helps/CorrigirCpfComZeros";
import { arrayInteressados } from "./Helps/ArrayInteressados";
import { GetEnvolvidoGhost } from "./RequisicaoAxiosTarefas/GetEnvolvidoGhost";
import { GetPessoaFisica } from "./RequisicaoAxiosTarefas/GetPessoaFisica";

export class CreateInterestedUseCase {


    async execute(data: IinteressadosDTO) {
        
        const resultado = {
            totalTarefas: 0,
            envolvidosCadastrados: 0,
            cpfNaoConstaNaReceita: 0,
            erroAoCadastrarEnvolvidos: [] as string[],
        };

        const cookie = await loginUseCase.execute(data.login);
        const usuario = (await getUsuarioUseCase.execute(cookie));
        const usuario_id = `${usuario[0].id}`;
        let novaCapa: any = false;
        let cpfCapa;

        let tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta });
        resultado.totalTarefas = tarefas.length;
        let arrayDeDocumentos: ResponseArvoreDeDocumento[];

        
        
        for(let i = 0; i < tarefas.length; i++){

            try{
                

                const tarefaId = tarefas[i].id
                const objectGetArvoreDocumento: IGetArvoreDocumentoDTO = { nup: tarefas[i].pasta.NUP, chave: tarefas[i].pasta.chaveAcesso, cookie, tarefa_id: tarefas[i].id }
                arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();

                //console.log(arrayDeDocumentos[47])
        
        
        
                const dossieSocial = arrayDeDocumentos.find(Documento => Documento.movimento.includes("CADUNICO"));
            
                const idDossieSocialParaPesquisa = dossieSocial.documentoJuntado.componentesDigitais[0].id;
                const paginaDossieSocial = await getDocumentoUseCase.execute({ cookie, idDocument: idDossieSocialParaPesquisa });
            
                const paginaDossieSocialFormatada = new JSDOM(paginaDossieSocial); 
    
    
                
    
                const tcapaParaVerificar: string = await getCapaDoPassivaUseCase.execute(tarefas[i].pasta.NUP, cookie);
                const tcapaFormatada = new JSDOM(tcapaParaVerificar)

                const tinfoClasseExist = await verificarCapaTrue(tcapaFormatada)
                try{

               

                    const capaParaVerificar: string = await getCapaDoPassivaUseCase.execute(tarefas[i].pasta.NUP, cookie);
                    const capaFormatada = new JSDOM(capaParaVerificar)
                    
                    const infoClasseExist = await verificarCapaTrue(capaFormatada) 
                    let capa = ""
                    if(!infoClasseExist){
                
                        const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b"
                        const novaNup = await getXPathText(capaFormatada, xpathNovaNup)
                        const nupFormatada:string = (novaNup.split('(')[0]).replace(/[./-]/g, "").trim();
                        capa = (await getCapaDoPassivaUseCase.execute(nupFormatada, cookie));
                        novaCapa = new JSDOM(capa)
                    }else{
                        
                        capa = (await getCapaDoPassivaUseCase.execute(tarefas[i].pasta.NUP, cookie));
                        novaCapa = new JSDOM(capa)
                    }



                    cpfCapa = buscarTableCpf(novaCapa);
                    if(!cpfCapa){
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: ` CPF NÃO ENCONTRADO - (GERAR NOVO DOSSIE)`, tarefaId }))
                        resultado.cpfNaoConstaNaReceita++;
                      continue;
                    }





        
                }catch(e){
                    /* return new Error("erro nos interessados") */
                    continue;
                }
    
                let InputArray = await GetInteressadosReq(tarefas[i].pasta_id, cookie)
                console.log('--RESPOSTA:')
                let ArrayEnvolvidos = arrayInteressados(InputArray)
                
                
                const buscarTabelaGrupoFamiliar = new BuscarTabelaGrupoFamiliar;
                const arrayCpfsInteressados = await buscarTabelaGrupoFamiliar.execute(paginaDossieSocialFormatada); 
                 
                let cpfInvalidoEncontrado = false
                let arrayDeCpfInvalido = []

                try {
                    for (let j = 0; j < arrayCpfsInteressados.length; j++ ) {

                        try {
                            console.log('aquiiiiiiiiiiii ' + CorrigirCpfComZeros(arrayCpfsInteressados[j].trim()))
                            let cpfExistente = ArrayEnvolvidos.filter((element) => element === CorrigirCpfComZeros(arrayCpfsInteressados[j].trim()))
                            console.log(cpfExistente)


                            if(CorrigirCpfComZeros(arrayCpfsInteressados[j].trim()) !== cpfCapa.trim() && !cpfExistente.length){
                                let envolvidoGhost = await GetEnvolvidoGhost(CorrigirCpfComZeros(arrayCpfsInteressados[j].trim()), cookie)
                                console.log('--GHOST DE FORA')
                                console.log(envolvidoGhost)

                                let pessoaFisica = await GetPessoaFisica(CorrigirCpfComZeros(arrayCpfsInteressados[j].trim()), cookie)
                                console.log('--PESSOA FISICA')
                                console.log(pessoaFisica)

                                const pessoa_id =  await GetPessoa_id(CorrigirCpfComZeros(arrayCpfsInteressados[j].trim()), cookie)
                                console.log('-----PESSOA ID NO LAÇO: ')
                                console.log(pessoa_id)
                                if (!pessoa_id) {
                                    throw new Error('CPF NÃO CONSTA NA RECEITA')
                                } else {
                                    const pasta_id = tarefas[i].pasta_id;
                                    await CreateTarefa(pasta_id, pessoa_id, cookie)
                                }
                            }

                            

                        } catch (error) {
                            arrayDeCpfInvalido.push(" " + CorrigirCpfComZeros(arrayCpfsInteressados[j].trim()))
                            cpfInvalidoEncontrado = true
                            if (error.message === 'CPF NÃO CONSTA NA RECEITA') {
                                await updateEtiquetaUseCase.execute({ cookie, etiqueta: `CPF ${arrayDeCpfInvalido} NÃO CONSTA NA RECEITA`, tarefaId })
                                resultado.cpfNaoConstaNaReceita++;
                            }
                        }




                        
    
                        
                    }

                    if (!cpfInvalidoEncontrado) {
                        await updateEtiquetaUseCase.execute({ cookie, etiqueta: `ENVOLVIDOS CADASTRADOS`, tarefaId })
                        resultado.envolvidosCadastrados++;
                    }


                } catch (error) {
                    await updateEtiquetaUseCase.execute({ cookie, etiqueta: `ERRO AO CADASTRAR ENVOLVIDOS`, tarefaId })
                    resultado.erroAoCadastrarEnvolvidos.push(tarefas[i].pasta.NUP);
                }

    
            }catch(e){
                console.log(e)
                resultado.erroAoCadastrarEnvolvidos.push(tarefas[i].pasta.NUP);
            }
        }

        return resultado;

    }

}
