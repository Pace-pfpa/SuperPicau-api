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

    const beneficioAtivo = requerimentos.filter(
        (req) => req.status === "ATIVO"
    ).map((req) => req.beneficio);
    if (beneficioAtivo.length > 0) {
        return {
            haveImpeditivo: true,
            tipoImpeditivo: 4,
            nomeImpeditivo: " BENEFÍCIO ATIVO -",
            informacaoExtra: beneficioAtivo,
        }
    }

    if (!dataAjuizamento) {
        console.warn("Data de ajuizamento não encontrada.");
        return {
            haveImpeditivo: false
        }
    }

    const concessaoImpeditivo: string[] = [];
    const concessaoAnterior = competenciasDetalhadas.find((beneficio) => {
        const dataCessacao = beneficio.dataFim;
        return dataCessacao 
            && beneficio.formaFiliacao === 'SEGURADO_ESPECIAL' 
            && calcularIdadeIdoso(dataAjuizamento, dataCessacao) <= 6;
    });
    if (concessaoAnterior) {
        concessaoImpeditivo.push(concessaoAnterior.origemDoVinculo)
        return {
            haveImpeditivo: true,
            tipoImpeditivo: 5,
            nomeImpeditivo: " CONCESSÃO ANTERIOR -",
            informacaoExtra: concessaoImpeditivo,
        };
    }

    const beneficioImpeditivo: string[] = [];
    const beneficioIncompativel = competenciasDetalhadas.find((beneficio) => {
        const dataCessacao = beneficio.dataFim;
        return dataCessacao 
            && beneficio.formaFiliacao !== 'SEGURADO_ESPECIAL' 
            && calcularIdadeIdoso(dataAjuizamento, dataCessacao) <= 6;
    });
    if (beneficioIncompativel) {
        beneficioImpeditivo.push(beneficioIncompativel.origemDoVinculo);
        return {
            haveImpeditivo: true,
            tipoImpeditivo: 6,
            nomeImpeditivo: " BENEFÍCIO INCOMPATÍVEL -",
            informacaoExtra: beneficioImpeditivo,
        }
    }

    return {
        haveImpeditivo: false
    }
}