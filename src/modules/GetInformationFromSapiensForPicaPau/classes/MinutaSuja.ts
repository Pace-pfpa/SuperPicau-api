import { createDocumentoUseCase } from "../../CreateDocumento";
import { getTarefaFacade } from "../../GetTarefa";
import { IInformacoesProcessoDTO, IInformacoesProcessoLoasDTO } from "../dto";

export class MinutaSuja {
    async maternidadeProcessoSujo(informacoesProcesso: IInformacoesProcessoDTO): Promise<void> {

        // const arrayMinutas: IMinutasDTO[] = [
        //     {
        //         numeroprocesso: informacoesProcesso.infoUpload.numeroProcesso,
        //         conteudo: '',
        //         nup: informacoesProcesso.infoUpload.nup,
        //     }
        // ];

        let createDocument: any;
        try {
            createDocument = await createDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                usuario_nome: informacoesProcesso.infoUpload.usuario_nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tid: '3',
                modelo_id: '609682', // Maternidade Suja
                tipoDocumento_id: '85' // Contestação
            });
    
            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }

        const documentoId = createDocument[0].id;

        const minutas = await getTarefaFacade.getMinutas(informacoesProcesso.cookie, 
                                                          informacoesProcesso.infoUpload.usuario_id, 
                                                          informacoesProcesso.infoUpload.etiqueta);

        console.log(documentoId);
        console.log(minutas[0].componentesDigitais[0].id);

        //const minutaHtml = await GetEditorMinutaFacade(minutaInfo) 

        //sapíens.agu.gov.br/editor?id=${documentoId}&c=${minutas[0].componentesDigitais.id}

        // try {
        //     const processoNome = obterNomeInteressadoPrincipal(informacoesProcesso.infoUpload);    
        //     await uploadDocumentUseCase.execute(informacoesProcesso.cookie, `${processoNome}${documentoId}impeditivos.html`, minutas[0].conteudo, documentoId);
        //     console.log("MINUTA SUBIU!");
        // } catch (error) {
        //     console.error("Erro ao fazer upload do documento:", error);
        //     throw new Error("Falha no upload do documento. Verifique o processo e tente novamente.");
        // }
    }

    async loasProcessoSujo(informacoesProcessoLoas: IInformacoesProcessoLoasDTO): Promise<void> {
        console.log("FUTURA MINUTA LOAS")
    }
}