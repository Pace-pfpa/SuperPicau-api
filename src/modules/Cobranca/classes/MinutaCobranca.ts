import { impeditivosHtmlCobranca } from "..";
import { createDocumentoUseCase } from "../../CreateDocumento";
import { getEditorMinutaUseCase } from "../../GetEditorMinuta";
import { GetEditorMinutaDTO } from "../../GetEditorMinuta/dtos/GetEditorMinutaDTO";
import { IInfoUploadDTO } from "../../GetInformationFromSapiensForPicaPau/dto";
import { atualizarHtmlEditor } from "../../GetInformationFromSapiensForPicaPau/utils/atualizarHtmlEditor";
import { obterHtmlETicketEditor } from "../../GetInformationFromSapiensForPicaPau/utils/obterHtmlETicketEditor";
import { ICobrancaExtracted } from "../interfaces/ICobrancaExtracted";
import { CobrancaLabras } from "../types/CobrancaLabras.types";
import { InfoCapa } from "../types/InfoCapa.type";
import { gerarObjetoUploadCobranca } from "../utils/gerarObjetoUploadCobranca";
import { getComponenteDigitalCobranca } from "../utils/getComponenteDigitalCobranca";

export default class MinutaCobranca {
    async cobrancaSemBens(
        cookie: string, 
        infoUpload: IInfoUploadDTO
    ): Promise<void> {
        let createDocument: any;
        try {
            createDocument = await createDocumentoUseCase.execute({
                cookie: cookie,
                usuario_nome: infoUpload.usuario.nome,
                usuario_setor: infoUpload.usuario_setor,
                tarefa_id: infoUpload.tarefa_id,
                pasta_id: infoUpload.pasta_id,
                tid: '3',
                modelo_id: '749818',
                tipoDocumento_id: '96'
            });
    
            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }
    }

    async cobrancaComBens(
        cobrancaExtracted: ICobrancaExtracted,
        impeditivos: string[],
        infoCapa: InfoCapa,
        impeditivosLabra: CobrancaLabras[]
    ): Promise<void> {
        const objetoUpload = gerarObjetoUploadCobranca(impeditivos);
        let htmlUpload = await impeditivosHtmlCobranca.execute(
            objetoUpload, 
            cobrancaExtracted, 
            infoCapa, 
            impeditivosLabra
        )
        
        let documentoId: number;
        try {
            const createDocument = await createDocumentoUseCase.execute({
                cookie: cobrancaExtracted.cookie,
                usuario_nome: cobrancaExtracted.infoUpload.usuario.nome,
                usuario_setor: cobrancaExtracted.infoUpload.usuario_setor,
                tarefa_id: cobrancaExtracted.infoUpload.tarefa_id,
                pasta_id: cobrancaExtracted.infoUpload.pasta_id,
                tid: '3',
                modelo_id: '749817',
                tipoDocumento_id: '96'
            });
            
            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }
        
            documentoId = createDocument[0].id;
        
            const componenteDigital_id = await getComponenteDigitalCobranca(cobrancaExtracted, documentoId);
        
            const editorInfo: GetEditorMinutaDTO = {
                cookie: cobrancaExtracted.cookie,
                documentoId: documentoId,
                minutaId: componenteDigital_id
            }
        
            await getEditorMinutaUseCase.execute(editorInfo);
            console.log(`Editor ativado para documento ID: ${documentoId}, componente ID: ${componenteDigital_id}`);
        
            const { ticket } = await obterHtmlETicketEditor(
                cobrancaExtracted.cookie,
                documentoId,
                componenteDigital_id
            );
            console.log(`Ticket obtido para edição do documento ID: ${documentoId}`);
        
            await atualizarHtmlEditor(cobrancaExtracted.cookie, documentoId, componenteDigital_id, ticket, htmlUpload);
        } catch (error) {
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }
    }
}
