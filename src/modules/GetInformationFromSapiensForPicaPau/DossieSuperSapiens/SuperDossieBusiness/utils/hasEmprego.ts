import { IRelacaoPrevidenciaria } from "../../../BuscarImpedimentos/dtos/interfaces/IRelacaoPrevidenciaria";
import { EmpregoDP } from "../../../dto";
import { IImpeditivoEmpregoMaternidade } from "../../../dto/RuralMaternidade/interfaces/IImpeditivoEmpregoMaternidade";

/**
 * Função auxiliar para converter uma string no formato "DD/MM/AAAA" em um objeto Date.
 */
function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Função auxiliar para converter uma string no formato "MM/AAAA" em um objeto Date.
 * Aqui, consideramos a data como o último dia do mês informado.
 */
function parseMonthYear(monthYear: string): Date {
    const [month, year] = monthYear.split('/');
    return new Date(Number(year), Number(month), 0);
}

/**
 * Função auxiliar para calcular a diferença em dias entre duas datas.
 */
function getDifferenceInDays(startDate: Date, endDate: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay);
}

/**
 * Verifica se a diferença entre a data de ajuizamento e a dataFim (ou ultimaRemuneracao) é de, no máximo, 6 anos.
 * Se a dataFim for depois da dataAjuizamento, ela não pode ultrapassar 6 anos para frente.
 * Se for antes, ela não pode ser anterior a 6 anos atrás.
 */
function isWithinSixYears(ajuizamento: Date, endDate: Date): boolean {
    if (endDate >= ajuizamento) {
      const sixYearsAfter = new Date(ajuizamento);
      sixYearsAfter.setFullYear(sixYearsAfter.getFullYear() + 6);
      return endDate <= sixYearsAfter;
    } else {
      const sixYearsBefore = new Date(ajuizamento);
      sixYearsBefore.setFullYear(sixYearsBefore.getFullYear() - 6);
      return endDate >= sixYearsBefore;
    }
}

export function hasEmprego(
    dataAjuizamento: string,
    relacoesPrevidenciarias: IRelacaoPrevidenciaria[]
): IImpeditivoEmpregoMaternidade {
    const ajuizamentoDate = parseDate(dataAjuizamento);

    if (relacoesPrevidenciarias.length === 0) return { haveImpeditivo: false }

    const possiveisEmpregos = relacoesPrevidenciarias.filter((emprego) => emprego.tipoFiliacao !== 'Benefício')
    if (possiveisEmpregos.length === 0) return { haveImpeditivo: false }

    let isVinculoAberto = false;
    const empregosImpeditivos: EmpregoDP[] = [];

    const acumuladorPorAno: Record<string, { totalDias: number, empregos: EmpregoDP[] }> = {};

    possiveisEmpregos.forEach(emprego => {
        if (!emprego.dataInicio) return;

        const startDate = parseDate(emprego.dataInicio);
        let endDate: Date | null = null;

        if (emprego.dataFim) {
            endDate = parseDate(emprego.dataFim);
        } else if (emprego.ultimaRemuneracao) {
            endDate = parseMonthYear(emprego.ultimaRemuneracao);
        } else {
            isVinculoAberto = true;
            empregosImpeditivos.push({
                vinculo: emprego.origemDoVinculo || '',
                dataInicio: emprego.dataInicio,
                dataFim: '',
                filiacao: emprego.tipoFiliacao || '',
                ocupacao: emprego.ocupacao || ''
            });
            return;
        }

        if (!isWithinSixYears(ajuizamentoDate, endDate)) return;

        const duracaoDias = getDifferenceInDays(startDate, endDate);

        if (duracaoDias >= 120) {
            empregosImpeditivos.push({
                vinculo: emprego.origemDoVinculo || '',
                dataInicio: emprego.dataInicio,
                dataFim: emprego.dataFim ? emprego.dataFim : (emprego.ultimaRemuneracao || ''),
                filiacao: emprego.tipoFiliacao || '',
                ocupacao: emprego.ocupacao || ''
            });
        } else {
            const ano = startDate.getFullYear().toString();
            if (!acumuladorPorAno[ano]) {
                acumuladorPorAno[ano] = { totalDias: 0, empregos: [] };
            }
            acumuladorPorAno[ano].totalDias += duracaoDias;
            acumuladorPorAno[ano].empregos.push({
                vinculo: emprego.origemDoVinculo || '',
                dataInicio: emprego.dataInicio,
                dataFim: emprego.dataFim ? emprego.dataFim : (emprego.ultimaRemuneracao || ''),
                filiacao: emprego.tipoFiliacao || '',
                ocupacao: emprego.ocupacao || ''
            })
        }
    })

    // Verifica os vínculos acumulados por ano: se a soma atingir ou ultrapassar 120 dias, esses vínculos são impedimentos.
    Object.keys(acumuladorPorAno).forEach(ano => {
        const { totalDias, empregos } = acumuladorPorAno[ano];
        if (totalDias >= 120) {
            empregosImpeditivos.push(...empregos);
        }
    });

    const haveImpeditivo = empregosImpeditivos.length > 0 || isVinculoAberto;
    return {
        haveImpeditivo,
        ...(isVinculoAberto ? { isVinculoAberto } : {}),
        ...(empregosImpeditivos.length > 0 ? { empregos: empregosImpeditivos } : {})
    };
}