import { IRequerimentos } from "../BuscarImpedimentos/dtos/interfaces/IRequerimentos";
import { getRequerimentoMaisAtual } from "../DossieSuperSapiens/SuperDossieBusiness/utils/getRequerimentoMaisAtual.util";
import { intervaloMaiorQueAnos } from "../DossieSuperSapiens/SuperDossieBusiness/utils/intervaloMaiorQueAnos.util";
import { parseDate } from "../DossieSuperSapiens/SuperDossieBusiness/utils/parseDate.util";

/**
 * Função auxiliar para retornar a data de requerimento do dossiê a partir de um array de requerimentos.
 * A função leva em conta apenas o campo DER para requerimentos com status "INDEFERIDO"
 * ou o campo DCB para requerimentos com status "CESSADO" ou "SUSPENSO".
 * Requerimentos com status "ATIVO" ou a ausência de requerimentos retornam null.
 * @param requerimentos Array de requerimentos.
 * @param dataAjuizamento Data de ajuizamento do dossiê, para o cálculo de tempo.
 * @returns A data de requerimento do processo ou null.
 */
export function getDERorDCB(
    requerimentos: IRequerimentos[], 
    dataAjuizamento: string
): string {
    try {
        if (requerimentos.length === 0) return null;

        const arrayIndeferidos = requerimentos.filter(
            (req) => req.status === "INDEFERIDO"
        );
        const indeferidoMaisAtual = getRequerimentoMaisAtual(arrayIndeferidos);

        const arrayCessadosOuSuspendos = requerimentos.filter(
            (req) => req.status === "CESSADO" || req.status === "SUSPENSO"
        );

        let requerimentoMaisAtual: IRequerimentos;
        let dataRequerimentoMaisAtual: Date;
        const dataDeAjuizamentoFormatada = parseDate(dataAjuizamento);

        if (arrayCessadosOuSuspendos.length > 0) {
            requerimentoMaisAtual = getRequerimentoMaisAtual(
                arrayCessadosOuSuspendos
            );
            dataRequerimentoMaisAtual = parseDate(requerimentoMaisAtual.dataCessacao)
                    
            const isRequerimentoAntigo = intervaloMaiorQueAnos(
                dataRequerimentoMaisAtual, 
                dataDeAjuizamentoFormatada, 
                5
            );

            if (isRequerimentoAntigo) {
                return indeferidoMaisAtual ? indeferidoMaisAtual.der : null;
            } else {
                return requerimentoMaisAtual.dataCessacao;
            }
        } else if (indeferidoMaisAtual) {
            return indeferidoMaisAtual.der;
        }

        return null;
    } catch (error) {
        console.error(error.message)
        return null;
    }
}
