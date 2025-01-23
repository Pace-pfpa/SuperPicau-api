import { getTarefaFacade } from "../../GetTarefa";
import { IInformacoesProcessoLoasDTO } from "../dto";

export async function getComponenteDigitalIDLoas(informacoesProcesso: IInformacoesProcessoLoasDTO, documentoId: number): Promise<number> {
    let componenteDigital_id: number = null;

    try {
        const arrayMinutas = await getTarefaFacade.getMinutas(informacoesProcesso.cookie, informacoesProcesso.infoUpload.usuario.id, informacoesProcesso.infoUpload.etiqueta);

        for (const minuta of arrayMinutas) {
            if (minuta.id === documentoId) {
                componenteDigital_id = minuta.componentesDigitais[0].id;
                break;
            }
        }

        return componenteDigital_id;
    } catch (error) {
        console.error("Erro ao buscar minutas:", error);
        throw new Error("Falha na busca das minutas. Verifique os dados e tente novamente.");
    }
}