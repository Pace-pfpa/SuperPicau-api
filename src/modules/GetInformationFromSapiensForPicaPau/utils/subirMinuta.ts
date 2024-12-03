
import { createDocumentoUseCase } from "../../CreateDocumento";
import { ImpeditivosHtmlLoas } from "../../CreateHtmlForLoas/impeditivosLoas";
import { ImpeditivosHtmlRuralMaternidade } from "../../CreateHtmlForRuralMaternidade/impeditivosRuralMaternidade";
import { uploadDocumentUseCase } from "../../UploadDocument";
import { gerarObjetoUpload } from "../helps/gerarObjetoUpload";
import { gerarObjetoUploadRM } from "../helps/gerarObjetoUploadRM";
import { obterNomeInteressadoPrincipal } from "./obterNomeInteressadoPrincipal";
import { IInformacoesProcessoDTO, 
        IInformacoesProcessoLoasDTO, 
        IMinutasDTO, 
        IObjInfoImpeditivosRM, 
        IResponseLabraAutorConjuge } from "../dto";

// Função antiga
export async function subirMinuta(
    informacoesProcesso: IInformacoesProcessoDTO | IInformacoesProcessoLoasDTO,
    impeditivos: string[], 
    impeditivosLabraRM: IResponseLabraAutorConjuge, 
    impeditivosDosprevRM: IObjInfoImpeditivosRM): Promise<void> {

    try {

        let htmlUpload: string;
        if (informacoesProcesso.tipo_triagem === 2) {
            
            const objetoUpload = gerarObjetoUpload(impeditivos);
            const htmlGenerator = new ImpeditivosHtmlLoas();
            htmlUpload = await htmlGenerator.execute(objetoUpload, informacoesProcesso.infoUpload.usuario_nome);
    
        } else if (informacoesProcesso.tipo_triagem === 0) {
    
            const objetoUpload = gerarObjetoUploadRM(impeditivos);
            const htmlGenerator = new ImpeditivosHtmlRuralMaternidade();
            htmlUpload = await htmlGenerator.execute(objetoUpload, informacoesProcesso.infoUpload.usuario_nome, 'RURAL', impeditivosLabraRM, impeditivosDosprevRM);
    
        } else if (informacoesProcesso.tipo_triagem === 1) {
    
            const objetoUpload = gerarObjetoUploadRM(impeditivos);
            const htmlGenerator = new ImpeditivosHtmlRuralMaternidade();
            htmlUpload = await htmlGenerator.execute(objetoUpload, informacoesProcesso.infoUpload.usuario_nome, 'MATERNIDADE', impeditivosLabraRM, impeditivosDosprevRM);
    
        }

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
                usuario_nome: informacoesProcesso.infoUpload.usuario_nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tid: '3'
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
        } catch (error) {
            console.error("Erro ao fazer upload do documento:", error);
            throw new Error("Falha no upload do documento. Verifique o processo e tente novamente.");
        }
    

    } catch (error) {
        console.error("Erro ao subir a minuta:", error);
        throw new Error("Falha ao subir a minuta. Verifique o processo e tente novamente.");
    }
    
}
