import { getTarefaFacade } from "../../GetTarefa";
import { ICobrancaExtracted } from "../interfaces/ICobrancaExtracted";

export async function getComponenteDigitalCobranca(
    cobrancaExtracted: ICobrancaExtracted, 
    documentoId: number
): Promise<number> {
    let componenteDigital_id: number = null;

    try {
        const arrayMinutas = await getTarefaFacade.getMinutas(
            cobrancaExtracted.cookie, 
            cobrancaExtracted.infoUpload.usuario.id, 
            cobrancaExtracted.infoUpload.etiqueta
        );

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