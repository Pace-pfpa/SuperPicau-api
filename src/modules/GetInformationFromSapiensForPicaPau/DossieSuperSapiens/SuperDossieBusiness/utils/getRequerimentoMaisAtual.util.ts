import { IRequerimentos } from "../../../BuscarImpedimentos/dtos/interfaces/IRequerimentos";
import { parseDate } from "./parseDate.util";

/**
 * Função auxiliar para identificar o requerimento mais atual a partir de um array de requerimentos.
 * A função utiliza a data de cessação para requerimentos com status "CESSADO" ou "SUSPENSO",
 * e o campo DER para requerimentos com status "INDEFERIDO".
 * @param requerimentos Array de requerimentos.
 * @returns O requerimento mais atual.
 */
export function getRequerimentoMaisAtual(requerimentos: IRequerimentos[]): IRequerimentos {
    return requerimentos.reduce((maisAtual, requerimento) => {
        if (requerimento.status === "CESSADO" || requerimento.status === "SUSPENSO") {
            const dataCessacaoAtual = parseDate(maisAtual.dataCessacao || '01/01/1970');
            const dataCessacaoRequerimento = parseDate(requerimento.dataCessacao || '01/01/1970');

            if (dataCessacaoRequerimento > dataCessacaoAtual) {
                return requerimento;
            }
        } else if (requerimento.status === "INDEFERIDO") {
            const derAtual = maisAtual.der || '';
            const derRequerimento = requerimento.der || '';

            if (derRequerimento > derAtual) {
                return requerimento;
            }
        }

        return maisAtual;
    }, requerimentos[0]);
}
