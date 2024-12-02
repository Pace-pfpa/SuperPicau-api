const { JSDOM } = require('jsdom');
import { getTarefaUseCase } from "../GetTarefa";
import { getUsuarioUseCase } from "../GetUsuario";
import { loginUseCase } from "../LoginUsuario";
import { updateEtiquetaUseCase } from "../UpdateEtiqueta";
import { GetArvoreDocumentoDTO, getArvoreDocumentoUseCase, ResponseArvoreDeDocumentoDTO } from '../GetArvoreDocumento';
import { coletarArvoreDeDocumentoDoPassivo } from "../GetInformationFromSapiensForPicaPau/helps/coletarArvoreDeDocumentoDoPassivo";
import { getDocumentoUseCase } from '../GetDocumento/index';
import { getXPathText } from '../../shared/utils/GetTextoPorXPATH';
import { GetInformationsFromSapiensDTO } from "../GetInformationFromSapiensForPicaPau";
import { VerificacaoDaQuantidadeDeDiasParaInspirarODossie } from "../../shared/utils/VerificacaoDaQuantidadeDeDiasParaInspirarODossie";

export class VerificadorValidadeDossiePrevidenciarioUseCase {

    async execute(data: GetInformationsFromSapiensDTO): Promise<Array<string>> {
        return new Promise(async (resolve, reject) => {

            const cookie = await loginUseCase.execute(data.login);
            const usuario = (await getUsuarioUseCase.execute(cookie));

            const usuario_id = `${usuario[0].id}`;

            let response: Array<any> = [];
            data.etiqueta = await data.etiqueta.toUpperCase()
            const etiquetaInvalida = data.etiqueta.includes("PROCESSO") || data.etiqueta.includes("DOSPREV")

            if (etiquetaInvalida) {
                reject(new Error("etiqueta não pode ter as palavras PROCESSO e/ou DOSPREV"))
            }

            const qunatidadeDeProcesso = 50;
            var tarefas: any[]
            do {
                tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta, qunatidadeDeProcesso })
                for (const tarefa of tarefas) {
                    const tarefaId = tarefa.id;
                    const objectGetArvoreDocumento: GetArvoreDocumentoDTO = { nup: tarefa.pasta.NUP, chave: tarefa.pasta.chaveAcesso, cookie, tarefa_id: tarefa.id }
                    let arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[];

                    try {
                        arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
                    } catch (error) {
                        console.log(error);
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV COM FALHA NA GERAÇAO", tarefaId }));
                        continue
                    }

                    var objectDosPrev = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla == "DOSPREV");

                    var objectDosPrevNaoExisti = objectDosPrev == null;
                    if (objectDosPrevNaoExisti) {
                        arrayDeDocumentos = await coletarArvoreDeDocumentoDoPassivo(objectGetArvoreDocumento)
                        objectDosPrev = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla == "DOSPREV");
                        objectDosPrevNaoExisti = objectDosPrev == null;
                        if (objectDosPrevNaoExisti) {
                            console.log("DOSPREV NÃO ECONTRADO");
                            (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV NÃO ECONTRADO", tarefaId }))
                            continue;
                        }
                    }

                    const dosPrevSemIdParaPesquisa = (objectDosPrev.documentoJuntado.componentesDigitais.length) <= 0;
                    if (dosPrevSemIdParaPesquisa) {
                        console.log("DOSPREV COM FALHA NA PESQUISA");
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV COM FALHA NA PESQUISA", tarefaId }))
                        continue;
                    }
                    const idDosprevParaPesquisa = objectDosPrev.documentoJuntado.componentesDigitais[0].id;
                    const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });

                    const parginaDosPrevFormatada = new JSDOM(parginaDosPrev);


                    const xpathInformacaoDeCabeçalho = "/html/body/div/p[2]/b[1]"
                    const informacaoDeCabeçalho = getXPathText(parginaDosPrevFormatada, xpathInformacaoDeCabeçalho);
                    //console.log("informacaoDeCabeçalho", informacaoDeCabeçalho)
                    const informacaoDeCabeçalhoNaoExiste = !informacaoDeCabeçalho;
                    if (informacaoDeCabeçalhoNaoExiste) {
                        console.log("DOSPREV FORA DO PRAZO DO PRAZO DE VALIDADE");
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV FORA DO PRAZO DO PRAZO DE VALIDADE", tarefaId }))
                        continue
                    }
                    // ative quando for para produçao
                    const diasParaInpirarDossie =  VerificacaoDaQuantidadeDeDiasParaInspirarODossie(informacaoDeCabeçalho);
                    
                    if (0 > diasParaInpirarDossie) {
                        console.log("DOSPREV FORA DO PRAZO DO PRAZO DE VALIDADE");
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV FORA DO PRAZO DO PRAZO DE VALIDADE", tarefaId }))
                        continue
                    }
                    response.push("DOSPREV VALIDADO")
                    console.log("DOSPREV VALIDADO");
                    (await updateEtiquetaUseCase.execute({ cookie, etiqueta: ("DOSPREV VALIDADO POR " + diasParaInpirarDossie +" DIAS"), tarefaId }))
                }
            } while (tarefas.length >= qunatidadeDeProcesso);

            resolve(await response)
        })

    }
}
