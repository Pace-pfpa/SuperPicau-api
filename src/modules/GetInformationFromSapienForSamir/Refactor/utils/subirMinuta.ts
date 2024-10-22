import { IInformacoesProcessoDTO } from "../../../../DTO/IInformacoesProcessoDTO";
import { IInformacoesProcessoLoasDTO } from "../../../../DTO/IInformacoesProcessoLoasDTO";
import { IInfoUploadDTO } from "../../../../DTO/IInfoUploadDTO";
import { createDocumentoUseCase } from "../../../CreateDocumento";
import { ImpeditivosHtmlLoas } from "../../../CreateHtmlForLoas/impeditivosLoas";
import { ImpeditivosHtmlRuralMaternidade } from "../../../CreateHtmlForRuralMaternidade/impeditivosRuralMaternidade";
import { uploadDocumentUseCase } from "../../../UploadDocument";
import { gerarObjetoUpload } from "../../helps/gerarObjetoUpload";
import { gerarObjetoUploadRM } from "../../helps/gerarObjetoUploadRM";

interface IMinutasDTO {
    numeroprocesso: string;
    conteudo: string;
    nup: string;
}

export async function subirMinuta(informacoesProcesso: IInformacoesProcessoDTO | IInformacoesProcessoLoasDTO, impeditivos: string[]): Promise<void> {
    try {

        let htmlUpload: string;
        if (informacoesProcesso.tipo_triagem === 2) {
            
            const objetoUpload = gerarObjetoUpload(impeditivos);
            const htmlGenerator = new ImpeditivosHtmlLoas();
            htmlUpload = await htmlGenerator.execute(objetoUpload, informacoesProcesso.infoUpload.usuario_nome);
    
        } else if (informacoesProcesso.tipo_triagem === 0) {
    
            const objetoUpload = gerarObjetoUploadRM(impeditivos);
            const htmlGenerator = new ImpeditivosHtmlRuralMaternidade();
            htmlUpload = await htmlGenerator.execute(objetoUpload, informacoesProcesso.infoUpload.usuario_nome, 'RURAL');
    
        } else if (informacoesProcesso.tipo_triagem === 1) {
    
            const objetoUpload = gerarObjetoUploadRM(impeditivos);
            const htmlGenerator = new ImpeditivosHtmlRuralMaternidade();
            htmlUpload = await htmlGenerator.execute(objetoUpload, informacoesProcesso.infoUpload.usuario_nome, 'MATERNIDADE');
    
        }
    
        const minutas: IMinutasDTO[] = [
            {
                numeroprocesso: informacoesProcesso.infoUpload.numeroProcesso,
                conteudo: htmlUpload,
                nup: informacoesProcesso.infoUpload.nup,
            }
        ];
    
        const createDocument = await createDocumentoUseCase.execute({
            cookie: informacoesProcesso.cookie,
            usuario_nome: informacoesProcesso.infoUpload.usuario_nome,
            usuario_setor: informacoesProcesso.infoUpload.usuario_setor,
            tarefa_id: informacoesProcesso.infoUpload.tarefa_id,
            pasta_id: informacoesProcesso.infoUpload.pasta_id,
            tid: '3'
        });
    
        const documentoId = createDocument[0].id;
    
        const processoNome = obterNomeInteressadoPrincipal(informacoesProcesso.infoUpload);
    
        await uploadDocumentUseCase.execute(informacoesProcesso.cookie, `${processoNome}${documentoId}impeditivos.html`, minutas[0].conteudo, documentoId);
        console.log("MINUTA SUBIU!");

    } catch (error) {
        console.error("Erro ao subir a minuta:", error);
        throw new Error("Falha ao subir a minuta. Verifique o processo e tente novamente.");
    }
    
}

function obterNomeInteressadoPrincipal(informacoesProcesso: IInfoUploadDTO): string {
    const interessados = informacoesProcesso.interessados;
    for (let interessado of interessados) {
        const nome = interessado.pessoa.nome;
        if (nome !== "MINIST�RIO P�BLICO fEDERAL (PROCURADORIA)" &&
            nome !== "MINISTERIO PUBLICO FEDERAL (PROCURADORIA)" &&
            nome !== "CENTRAL DE ANÁLISE DE BENEFÍCIO - CEAB/INSS" &&
            nome !== "INSTITUTO NACIONAL DO SEGURO SOCIAL-INSS" &&
            nome !== "INSTITUTO NACIONAL DO SEGURO SOCIAL - INSS") {
            return nome.split(" ")[0];
        }
    }
    return "DESCONHECIDO";
}