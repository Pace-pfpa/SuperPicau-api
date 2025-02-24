import { IRequerimentos } from "../../../BuscarImpedimentos/dtos/interfaces/IRequerimentos";
import { IImpeditivoDossie } from "../../../dto/RuralMaternidade/interfaces/IImpeditivoDossie";
import { getRequerimentoMaisAtual } from "./getRequerimentoMaisAtual.util";
import { intervaloMaiorQueAnos } from "./intervaloMaiorQueAnos.util";
import { parseDate } from "./parseDate.util";

export function hasImpeditivoDossieLoas(
    dataAjuizamento: string,
    requerimentos: IRequerimentos[]
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
        const isBpc = beneficioAtivo.some(
            (beneficio) => beneficio.startsWith("87") || beneficio.startsWith("88")
        );

        return {
            haveImpeditivo: true,
            tipoImpeditivo: isBpc ? 4 : 5,
            nomeImpeditivo: isBpc ? " BPC ATIVO -" : " BENEFÍCIO ATIVO -",
            informacaoExtra: beneficioAtivo,
        }
    }

    let requerimentoMaisAtual: IRequerimentos;
    let dataRequerimentoMaisAtual: Date;
    const dataDeAjuizamentoFormatada = parseDate(dataAjuizamento);

    const arrayRequerimentosCessadosOuSuspensos = requerimentos.filter(
        (req) => req.status === "CESSADO" || req.status === "SUSPENSO"
    );
    
    if (
        arrayRequerimentosCessadosOuSuspensos.length > 0
    ) {
        requerimentoMaisAtual = getRequerimentoMaisAtual(
            arrayRequerimentosCessadosOuSuspensos
        );
        dataRequerimentoMaisAtual = parseDate(requerimentoMaisAtual.dataCessacao)
        
        const isRequerimentoAntigo = intervaloMaiorQueAnos(
            dataRequerimentoMaisAtual, 
            dataDeAjuizamentoFormatada, 
            5
        );

        if (isRequerimentoAntigo) { // SE NÃO, É RESTABELECIMENTO
            const haveIndeferido = requerimentos.some(
                (req) => req.status === "INDEFERIDO"
            );

            if (haveIndeferido) {
                return {
                    haveImpeditivo: false
                }    
            }
            
            return {
                haveImpeditivo: true,
                tipoImpeditivo: 3,
                nomeImpeditivo: " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -",
            }
        }
    }

    return {
        haveImpeditivo: false
    }
}