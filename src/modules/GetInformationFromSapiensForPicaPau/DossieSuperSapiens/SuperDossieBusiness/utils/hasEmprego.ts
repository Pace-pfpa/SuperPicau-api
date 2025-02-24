import { IRelacaoPrevidenciaria } from "../../../BuscarImpedimentos/dtos/interfaces/IRelacaoPrevidenciaria";
import { EmpregoDP } from "../../../dto";
import { IImpeditivoEmpregoMaternidade } from "../../../dto/RuralMaternidade/interfaces/IImpeditivoEmpregoMaternidade";
import { parseDate } from "./parseDate.util";

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

    const relacoesExcludentes = ['Benefício', 'Segurado Especial'];
    const possiveisEmpregos = relacoesPrevidenciarias.filter((emprego) =>
        !relacoesExcludentes.some(relacao => emprego.tipoFiliacao.includes(relacao))
    );
    if (possiveisEmpregos.length === 0) return { haveImpeditivo: false }

    const allClosedJobs: { emprego: EmpregoDP; startDate: Date; endDate: Date }[] = [];
    const impeditiveClosedJobs: EmpregoDP[] = [];

    const acumuladorPorAno: Record<string, { totalDias: number, empregos: EmpregoDP[] }> = {};
    const openEmployments: { emprego: EmpregoDP; startDate: Date }[] = [];

    possiveisEmpregos.forEach(emprego => {
        if (!emprego.dataInicio) return;
        const startDate = parseDate(emprego.dataInicio);

        let endDate: Date | null = null;
        let isClosed = false;

        if (emprego.dataFim) {
            endDate = parseDate(emprego.dataFim);
            isClosed = true;
        } else if (emprego.ultimaRemuneracao) {
            endDate = parseMonthYear(emprego.ultimaRemuneracao);
            isClosed = true;
        } 

        const empregoDP: EmpregoDP = {
            vinculo: emprego.origemDoVinculo || '',
            dataInicio: emprego.dataInicio,
            dataFim: emprego.dataFim ? emprego.dataFim : (emprego.ultimaRemuneracao || ''),
            filiacao: emprego.tipoFiliacao || '',
            ocupacao: emprego.ocupacao || ''
        };

        if (isClosed && endDate) {
            if (!isWithinSixYears(ajuizamentoDate, endDate)) return;
            allClosedJobs.push({ emprego: empregoDP, startDate, endDate });

            const duracaoDias = getDifferenceInDays(startDate, endDate);
            if (duracaoDias >= 120) {
                impeditiveClosedJobs.push(empregoDP);
            } else {
                const ano = startDate.getFullYear().toString();
                if (!acumuladorPorAno[ano]) {
                    acumuladorPorAno[ano] = { totalDias: 0, empregos: [] };
                }
                acumuladorPorAno[ano].totalDias += duracaoDias;
                acumuladorPorAno[ano].empregos.push(empregoDP);
            }
        } else {
            openEmployments.push({ emprego: empregoDP, startDate });
        }
    })

    let isVinculoAberto = false;
    const empregosImpeditivos: EmpregoDP[] = [];
    
    Object.keys(acumuladorPorAno).forEach(ano => {
        const { totalDias, empregos } = acumuladorPorAno[ano];
        if (totalDias >= 120) {
            empregosImpeditivos.push(...empregos);
        }
    });

    if (impeditiveClosedJobs.length > 0) {
        empregosImpeditivos.push(...impeditiveClosedJobs);
    } else {
        if (allClosedJobs.length > 0 && openEmployments.length > 0) {
            const sortedOpen = openEmployments.sort(
                (a, b) => b.startDate.getTime() - a.startDate.getTime()
              );
            const mostRecentOpen = sortedOpen[0];

            const sortedClosed = allClosedJobs.sort(
                (a, b) => b.endDate.getTime() - a.endDate.getTime()
              );
            const mostRecentClosed = sortedClosed[0];

            if (mostRecentOpen.startDate.getTime() > mostRecentClosed.endDate.getTime()) {
                isVinculoAberto = true;
                empregosImpeditivos.push(mostRecentOpen.emprego);
            }
        } else if (allClosedJobs.length === 0 && openEmployments.length > 0) {
            const sortedOpen = openEmployments.sort(
                (a, b) => b.startDate.getTime() - a.startDate.getTime()
              );
            isVinculoAberto = true;
            empregosImpeditivos.push(sortedOpen[0].emprego);
        }
    }

    const haveImpeditivo = empregosImpeditivos.length > 0 || isVinculoAberto;
    return {
        haveImpeditivo,
        ...(isVinculoAberto ? { isVinculoAberto } : {}),
        ...(empregosImpeditivos.length > 0 ? { empregos: empregosImpeditivos } : {})
    };
}