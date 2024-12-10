import { createDocumentoUseCase } from "../../CreateDocumento";
import { ImpeditivosHtmlMaternidade } from "../../CreateHtmlForRM/impeditivosHtmlMaternidade";
import { uploadDocumentUseCase } from "../../UploadDocument";
import { IInformacoesProcessoDTO, IInformacoesProcessoLoasDTO, IMinutasDTO, IObjInfoImpeditivosRM, IResponseLabraAutorConjuge } from "../dto";
import { gerarObjetoUploadRM } from "../helps/gerarObjetoUploadRM";
import { obterNomeInteressadoPrincipal } from "../utils";

export class MinutaSuja {
    async maternidadeProcessoSujo(informacoesProcesso: IInformacoesProcessoDTO, impeditivosDosprev: IObjInfoImpeditivosRM, impeditivosLabras: IResponseLabraAutorConjuge, impeditivos: string[]): Promise<void> {
        let htmlUpload: string;

        const objetoUpload = gerarObjetoUploadRM(impeditivos);
        const htmlGenerator = new ImpeditivosHtmlMaternidade();

        htmlUpload = await htmlGenerator.execute(objetoUpload, informacoesProcesso.infoUpload, impeditivosDosprev, impeditivosLabras);

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
        } catch (error) {
            console.error("Erro ao fazer upload do documento:", error);
            throw new Error("Falha no upload do documento. Verifique o processo e tente novamente.");
        }
    }

    async ruralProcessoSujo(informacoesProcesso: IInformacoesProcessoDTO): Promise<void> {
        console.log("FUTURA MINUTA RURAL")
    }

    async loasProcessoSujo(informacoesProcessoLoas: IInformacoesProcessoLoasDTO): Promise<void> {
        console.log("FUTURA MINUTA LOAS")
    }
}