import { IRelacaoPrevidenciariaDetalhada } from "../../../BuscarImpedimentos/dtos/interfaces/IRelacaoPrevidenciariaDetalhada";
import { IRequerimentos } from "../../../BuscarImpedimentos/dtos/interfaces/IRequerimentos";
import { IImpeditivoDossie } from "../../../dto/RuralMaternidade/interfaces/IImpeditivoDossie";
import { calcularIdadeIdoso } from "../../../loas/Business/Help/CalcularIdadeIdoso";

export function hasImpeditivoDossie(
    dataAjuizamento: string,
    requerimentos: IRequerimentos[],
    competenciasDetalhadas: IRelacaoPrevidenciariaDetalhada[]
): IImpeditivoDossie {
    if (requerimentos.length === 0) {
        return {
            haveImpeditivo: true,
            tipoImpeditivo: 3,
            nomeImpeditivo: " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -",
        }
    }

    const beneficioAtivo = requerimentos.filter((req) => req.status === "ATIVO").map((req) => req.beneficio);
    if (beneficioAtivo.length > 0) {
        return {
            haveImpeditivo: true,
            tipoImpeditivo: 4,
            nomeImpeditivo: " BENEFÍCIO ATIVO -",
            informacaoExtra: beneficioAtivo,
        }
    }

    if (!dataAjuizamento) {
        console.warn("Data de ajuizamento não encontrada.")
        return {
            haveImpeditivo: false
        }
    }

    const concessaoAnterior = competenciasDetalhadas.some((beneficio) => {
        const dataCessacao = beneficio.dataFim;
        if (dataCessacao && beneficio.formaFiliacao === 'SEGURADO_ESPECIAL') {
            const anosParaVerificar = calcularIdadeIdoso(dataAjuizamento, dataCessacao);
            if (anosParaVerificar <= 6) return true;
        }
    });
    if (concessaoAnterior) {
        return {
            haveImpeditivo: true,
            tipoImpeditivo: 5,
            nomeImpeditivo: " CONCESSÃO ANTERIOR -",
        }
    }

    const beneficioIncompativel = competenciasDetalhadas.some((beneficio) => {
        const dataCessacao = beneficio.dataFim;
        if (dataCessacao && beneficio.formaFiliacao !== 'SEGURADO_ESPECIAL') {
            const anosParaVerificar = calcularIdadeIdoso(dataAjuizamento, dataCessacao);
            if (anosParaVerificar <= 6) return true;
        } 
    })
    if (beneficioIncompativel) {
        return {
            haveImpeditivo: true,
            tipoImpeditivo: 6,
            nomeImpeditivo: " BENEFÍCIO INCOMPATÍVEL -",
        }
    }

    return {
        haveImpeditivo: false
    }
}