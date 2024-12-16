import { createDocumentoUseCase } from "../../CreateDocumento";
import { IInformacoesProcessoDTO, IInformacoesProcessoLoasDTO } from "../dto";

export class MinutaLimpa {
    async maternidadeProcessoLimpo(informacoesProcesso: IInformacoesProcessoDTO): Promise<void> {

        let createDocument: any;
        try {
            createDocument = await createDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                usuario_nome: informacoesProcesso.infoUpload.usuario.nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tid: '3',
                modelo_id: '726514', // Maternidade Limpo
                tipoDocumento_id: '85' // Contestação
            });
    
            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }
    }

    async ruralProcessoLimpo(informacoesProcesso: IInformacoesProcessoDTO): Promise<void> {
        let createDocument: any;
        try {
            createDocument = await createDocumentoUseCase.execute({
                cookie: informacoesProcesso.cookie,
                usuario_nome: informacoesProcesso.infoUpload.usuario.nome,
                usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
                tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
                pasta_id: informacoesProcesso.infoUpload.pasta_id,
                tid: '3',
                modelo_id: '613060', // Rural Limpo 
                tipoDocumento_id: '85' 
            });

            if (!createDocument || !Array.isArray(createDocument) || createDocument.length === 0 || !createDocument[0].id) {
                throw new Error("Falha ao criar o documento ou ID não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao criar o documento:", error);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }
    }

    async loasProcessoLimpo(informacoesProcessoLoas: IInformacoesProcessoLoasDTO): Promise<void> {
        console.log("FUTURA MINUTA LOAS")
    }
}