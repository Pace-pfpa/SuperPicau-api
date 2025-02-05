import { createDocumentoUseCase } from "../../CreateDocumento";
import { impeditivosHtmlLoas, impeditivosHtmlMaternidade, impeditivosHtmlRural } from "../../CreateHtmlForRM";
import { getEditorMinutaUseCase } from "../../GetEditorMinuta";
import { GetEditorMinutaDTO } from "../../GetEditorMinuta/dtos/GetEditorMinutaDTO";
import { updateDocumentoUseCase } from "../../UpdateDocumento";
import { IInformacoesProcessoDTO, 
        IInformacoesProcessoLoasDTO, 
        IObjInfoImpeditivosLoas, 
        IObjInfoImpeditivosMaternidade,
        IResponseLabraAutorConjugeRural} from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { IResponseLabraAutorGF } from "../dto/Sislabra/interfaces/IResponseLabraAutorGF";
import { gerarObjetoUploadRural } from "../../CreateHtmlForRM/utils/gerarObjetoUploadRural";
import { atualizarHtmlEditor } from "../utils/atualizarHtmlEditor";
import { getComponenteDigitalIDRM } from "../utils/getComponenteDigitalIDRM";
import { obterHtmlETicketEditor } from "../utils/obterHtmlETicketEditor";
import { gerarObjetoUploadLoas } from "../../CreateHtmlForRM/utils/gerarObjetoUploadLoas";
import { getComponenteDigitalIDLoas } from "../utils/getComponenteDigitalIDLoas";
import { IResponseLabraAutorConjugeMaternidade } from "../dto/Sislabra/interfaces/maternidade/IResponseLabraAutorConjugeMaternidade";
import { gerarObjetoUploadMaternidade } from "../../CreateHtmlForRM/utils/gerarObjetoUploadMaternidade";

export class MinutaSuja {
    async maternidadeProcessoSujo(
        informacoesProcesso: IInformacoesProcessoDTO, 
        impeditivosDosprev: IObjInfoImpeditivosMaternidade, 
        impeditivosLabras: IResponseLabraAutorConjugeMaternidade, 
        impeditivos: string[]
    ): Promise<void> {
        const objetoUpload = gerarObjetoUploadMaternidade(impeditivos);
        let htmlUpload = await impeditivosHtmlMaternidade.execute(objetoUpload, informacoesProcesso.infoUpload, impeditivosDosprev, impeditivosLabras);

        let documentoId: number;
        try {
            const createDocument = await createDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                usuario_nome: informacoesProcesso.infoUpload.usuario.nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tid: '3',
                modelo_id: '609682',
                tipoDocumento_id: '85'
            });
    
            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }

            documentoId = createDocument[0].id;

            const componenteDigital_id = await getComponenteDigitalIDRM(informacoesProcesso, documentoId);

            const editorInfo: GetEditorMinutaDTO = {
                cookie: informacoesProcesso.cookie,
                documentoId: documentoId,
                minutaId: componenteDigital_id
            }

            await getEditorMinutaUseCase.execute(editorInfo);
            console.log(`Editor ativado para documento ID: ${documentoId}, componente ID: ${componenteDigital_id}`);

            const { ticket } = await obterHtmlETicketEditor(
                informacoesProcesso.cookie,
                documentoId,
                componenteDigital_id
            );
            console.log(`Ticket obtido para edição do documento ID: ${documentoId}`);

            await atualizarHtmlEditor(informacoesProcesso.cookie, documentoId, componenteDigital_id, ticket, htmlUpload);
        } catch (error) {
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }

        try {
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
            console.log(`Dossiê atualizado para documento ID: ${documentoId}`);
        } catch (error) {
            console.error("Erro ao fazer upload do documento:", error);
            throw new Error("Falha no upload do documento. Verifique o processo e tente novamente.");
        }
    }

    async ruralProcessoSujo(
        informacoesProcesso: IInformacoesProcessoDTO, 
        impeditivosDosprev: IObjInfoImpeditivosRural, 
        impeditivosLabras: IResponseLabraAutorConjugeRural, 
        impeditivos: string[]
    ): Promise<void> {
        const objetoUpload = gerarObjetoUploadRural(impeditivos);
        let htmlUpload = await impeditivosHtmlRural.execute(objetoUpload, informacoesProcesso.infoUpload, impeditivosDosprev, impeditivosLabras);

        let documentoId: number;
        try {
            const createDocument = await createDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                usuario_nome: informacoesProcesso.infoUpload.usuario.nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tid: '3',
                modelo_id: '546274',
                tipoDocumento_id: '85'
            });
    
            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }

            documentoId = createDocument[0].id;

            const componenteDigital_id = await getComponenteDigitalIDRM(informacoesProcesso, documentoId);

            const editorInfo: GetEditorMinutaDTO = {
                cookie: informacoesProcesso.cookie,
                documentoId: documentoId,
                minutaId: componenteDigital_id
            }

            await getEditorMinutaUseCase.execute(editorInfo);
            console.log(`Editor ativado para documento ID: ${documentoId}, componente ID: ${componenteDigital_id}`);

            const { ticket } = await obterHtmlETicketEditor(
                informacoesProcesso.cookie,
                documentoId,
                componenteDigital_id
            );
            console.log(`Ticket obtido para edição do documento ID: ${documentoId}`);

            await atualizarHtmlEditor(informacoesProcesso.cookie, documentoId, componenteDigital_id, ticket, htmlUpload);
        } catch (error) { 
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }

        try {
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
            console.log(`Dossiê atualizado para documento ID: ${documentoId}`);

        } catch (error) {
            console.error("Erro ao fazer upload do documento:", error);
            throw new Error("Falha no upload do documento. Verifique o processo e tente novamente.");
        }
    }

    async loasProcessoSujo(
        informacoesProcessoLoas: IInformacoesProcessoLoasDTO, 
        impeditivosDosprev: IObjInfoImpeditivosLoas, 
        impeditivosLabras: IResponseLabraAutorGF, 
        impeditivos: string[]
    ): Promise<void> {
        const objetoUpload = gerarObjetoUploadLoas(impeditivos);
        let htmlUpload = await impeditivosHtmlLoas.execute(objetoUpload, informacoesProcessoLoas.infoUpload, impeditivosDosprev, impeditivosLabras);

        let documentoId: number;
        try {
            const createDocument = await createDocumentoUseCase.execute({
                cookie: informacoesProcessoLoas.cookie,
                usuario_nome: informacoesProcessoLoas.infoUpload.usuario.nome,
                usuario_setor: informacoesProcessoLoas.infoUpload.usuario_setor,
                tarefa_id: informacoesProcessoLoas.infoUpload.tarefa_id,
                pasta_id: informacoesProcessoLoas.infoUpload.pasta_id,
                tid: '3',
                modelo_id: '734226',
                tipoDocumento_id: '85'
            });

            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }

            documentoId = createDocument[0].id;

            const componenteDigital_id = await getComponenteDigitalIDLoas(informacoesProcessoLoas, documentoId);

            const editorInfo: GetEditorMinutaDTO = {
                cookie: informacoesProcessoLoas.cookie,
                documentoId: documentoId,
                minutaId: componenteDigital_id
            }

            await getEditorMinutaUseCase.execute(editorInfo);
            console.log(`Editor ativado para documento ID: ${documentoId}, componente ID: ${componenteDigital_id}`);

            const { ticket } = await obterHtmlETicketEditor(
                informacoesProcessoLoas.cookie,
                documentoId,
                componenteDigital_id
            );
            console.log(`Ticket obtido para edição do documento ID: ${documentoId}`);
            
            await atualizarHtmlEditor(informacoesProcessoLoas.cookie, documentoId, componenteDigital_id, ticket, htmlUpload);
        } catch (error) {
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 5000));

            await updateDocumentoUseCase.execute({
                cookie: informacoesProcessoLoas.cookie,
                dosprev_id: informacoesProcessoLoas.dosprevPoloAtivo.documentoJuntado_id,
                minuta_id: documentoId,
                pasta_id: informacoesProcessoLoas.infoUpload.pasta_id,
                tarefa_id: informacoesProcessoLoas.infoUpload.tarefa_id,
                tipoDocumento_id: '35',
                usuario_nome: informacoesProcessoLoas.infoUpload.usuario.nome,
                usuario_setor: informacoesProcessoLoas.infoUpload.usuario_setor,
                tid: '10'
            })
            console.log(`Dossiê atualizado para documento ID: ${documentoId}`);

        } catch (error) {
            console.error("Erro ao fazer upload do documento:", error);
            throw new Error("Falha no upload do documento. Verifique o processo e tente novamente.");
        }
    }
}