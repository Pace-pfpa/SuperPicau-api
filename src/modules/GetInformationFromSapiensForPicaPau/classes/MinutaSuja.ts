import { createDocumentoUseCase } from "../../CreateDocumento";
import { impeditivosHtmlMaternidade, impeditivosHtmlRural } from "../../CreateHtmlForRM";
import { updateDocumentoUseCase } from "../../UpdateDocumento";
import { uploadDocumentUseCase } from "../../UploadDocument";
import { IInformacoesProcessoDTO, IInformacoesProcessoLoasDTO, IMinutasDTO, IObjInfoImpeditivosMaternidade, IResponseLabraAutorConjuge } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { gerarObjetoUploadRM } from "../helps/gerarObjetoUploadRM";
import { obterNomeInteressadoPrincipal } from "../utils";

export class MinutaSuja {
    async maternidadeProcessoSujo(informacoesProcesso: IInformacoesProcessoDTO, impeditivosDosprev: IObjInfoImpeditivosMaternidade, impeditivosLabras: IResponseLabraAutorConjuge, impeditivos: string[]): Promise<void> {
        let htmlUpload: string;

        const objetoUpload = gerarObjetoUploadRM(impeditivos);
        htmlUpload = await impeditivosHtmlMaternidade.execute(objetoUpload, informacoesProcesso.infoUpload, impeditivosDosprev, impeditivosLabras);

        const minutas: IMinutasDTO[] = [
            {
                numeroprocesso: informacoesProcesso.infoUpload.numeroProcesso,
                conteudo: htmlUpload,
                nup: informacoesProcesso.infoUpload.nup,
            }
        ];

        let createDocument: any;
        try {
            createDocument = await createDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                usuario_nome: informacoesProcesso.infoUpload.usuario.nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tid: '3',
                // modelo_id: '609682', Maternidade Suja
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

        try {
            const processoNome = obterNomeInteressadoPrincipal(informacoesProcesso.infoUpload);    
            await uploadDocumentUseCase.execute(informacoesProcesso.cookie, `${processoNome}${documentoId}impeditivos.html`, minutas[0].conteudo, documentoId);
            console.log("MINUTA SUBIU!");
            await new Promise(resolve => setTimeout(resolve, 5000));

            await updateDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                dosprev_id: informacoesProcesso.dosprevPoloAtivo.documentoJuntado_id,
                minuta_id: documentoId,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                tipoDocumento_id: '35',
                usuario_nome: informacoesProcesso.infoUpload.usuario.nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tid: '10'
            })
            console.log("DOSSIÊ SUBIU");
        } catch (error) {
            console.error("Erro ao fazer upload do documento:", error);
            throw new Error("Falha no upload do documento. Verifique o processo e tente novamente.");
        }
    }

    async ruralProcessoSujo(informacoesProcesso: IInformacoesProcessoDTO, impeditivosDosprev: IObjInfoImpeditivosRural, impeditivosLabras: IResponseLabraAutorConjuge, impeditivos: string[]): Promise<void> {
        let htmlUpload: string;

        const objetoUpload = gerarObjetoUploadRM(impeditivos);
        htmlUpload = await impeditivosHtmlRural.execute(objetoUpload, informacoesProcesso.infoUpload, impeditivosDosprev, impeditivosLabras);

        const minutas: IMinutasDTO[] = [
            {
                numeroprocesso: informacoesProcesso.infoUpload.numeroProcesso,
                conteudo: htmlUpload,
                nup: informacoesProcesso.infoUpload.nup,
            }
        ];

        let createDocument: any;
        try {
            createDocument = await createDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                usuario_nome: informacoesProcesso.infoUpload.usuario.nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tid: '3',
                tipoDocumento_id: '85'
            });

            // 546274 -> Rural Sujo
    
            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }

        const documentoId = createDocument[0].id;

        try {
            const processoNome = obterNomeInteressadoPrincipal(informacoesProcesso.infoUpload);    
            await uploadDocumentUseCase.execute(informacoesProcesso.cookie, `${processoNome}${documentoId}impeditivos.html`, minutas[0].conteudo, documentoId);
            console.log("MINUTA SUBIU!");
            await new Promise(resolve => setTimeout(resolve, 5000));

            await updateDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                dosprev_id: informacoesProcesso.dosprevPoloAtivo.documentoJuntado_id,
                minuta_id: documentoId,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                tipoDocumento_id: '35',
                usuario_nome: informacoesProcesso.infoUpload.usuario.nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tid: '10'
            })
            console.log("DOSSIÊ SUBIU!");

        } catch (error) {
            console.error("Erro ao fazer upload do documento:", error);
            throw new Error("Falha no upload do documento. Verifique o processo e tente novamente.");
        }
    }

    async loasProcessoSujo(informacoesProcessoLoas: IInformacoesProcessoLoasDTO): Promise<void> {
        console.log("FUTURA MINUTA LOAS")
    }
}