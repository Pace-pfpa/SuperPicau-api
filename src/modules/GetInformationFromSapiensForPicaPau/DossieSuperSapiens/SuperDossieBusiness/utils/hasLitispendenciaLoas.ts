import { IProcessosMovidos } from "../../../BuscarImpedimentos/dtos/interfaces/IProcessosMovidos";
import { IRequerimentos } from "../../../BuscarImpedimentos/dtos/interfaces/IRequerimentos";
import { IImpeditivoLitispendencia } from "../../../dto";
import { getRequerimentoMaisAtual } from "./getRequerimentoMaisAtual.util";
import { parseDate } from "./parseDate.util";

export function hasLitispendenciaLoas(
    numeroUnico: string, 
    processos: IProcessosMovidos[],
    requerimentos: IRequerimentos[],
): IImpeditivoLitispendencia {
    const palavrasProibidas: string[] = [
        "PESSOA COM DEFICIÊNCIA", 
        "IDOSO", 
        "BENEFÍCIO ASSISTENCIAL"
    ];

    if (processos.length === 0) {
        return {
            haveLitispendencia: false,
            litispendencia: []
        }
    }

    const processosDiferentes = processos.filter(
        (pro) => pro.numeroProcesso !== numeroUnico
    )

    if (processosDiferentes.length === 0) {
        return {
            haveLitispendencia: false,
            litispendencia: []
        }
    }

    const arrayLitispendencia = processosDiferentes.filter((processo) => {
        for (const palavra of palavrasProibidas) {
            if (processo.assunto.includes(palavra)) return processo;
        }
    })

    const numeroDosProcessosFiltrados = arrayLitispendencia.map(
        (pro) => pro.numeroProcesso
    );

    if (arrayLitispendencia.length === 0) {
        return {
            haveLitispendencia: false,
            litispendencia: []
        }
    }

    // REQUERIMENTOS

    if (requerimentos.length === 0) {
        return {
            haveLitispendencia: arrayLitispendencia.length > 0,
            litispendencia: numeroDosProcessosFiltrados
        }
    }

    let requerimentoMaisAtual: IRequerimentos;
    let dataRequerimentoMaisAtual: Date;
    const arrayRequerimentosCessadosOuSuspensos = requerimentos.filter(
        (req) => req.status === "CESSADO" || req.status === "SUSPENSO"
    );

    if (arrayRequerimentosCessadosOuSuspensos.length > 0) {
        requerimentoMaisAtual = getRequerimentoMaisAtual(
            arrayRequerimentosCessadosOuSuspensos
        );
        dataRequerimentoMaisAtual = parseDate(requerimentoMaisAtual.dataCessacao)
    } else {
        requerimentoMaisAtual = getRequerimentoMaisAtual(
            requerimentos
        );
        dataRequerimentoMaisAtual = parseDate(requerimentoMaisAtual.der)
    }

    const litispendenciasMaisAtuais = arrayLitispendencia.filter((processo) => {
        const dataAjuizamento = parseDate(processo.ajuizamento || '01/01/1970');
        return dataAjuizamento > dataRequerimentoMaisAtual;
    }).map((pro) => pro.numeroProcesso);

    return {
        haveLitispendencia: litispendenciasMaisAtuais.length > 0,
        litispendencia: litispendenciasMaisAtuais
    }
}