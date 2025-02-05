import { IProcessosMovidos } from "../../../BuscarImpedimentos/dtos/interfaces/IProcessosMovidos";
import { IImpeditivoLitispendencia } from "../../../dto";

export function hasLitispendencia(numeroUnico: string, processos: IProcessosMovidos[]): IImpeditivoLitispendencia {
    const palavrasProibidas: string[] = ["SALÁRIO-MATERNIDADE", "RURAL"];

    if (processos.length === 0) {
        return {
            haveLitispendencia: false,
            litispendencia: []
        }
    }

    const processosDiferentes = processos.filter((pro) => pro.numeroProcesso !== numeroUnico)

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
    }).map(processo => processo.numeroProcesso);

    return {
        haveLitispendencia: arrayLitispendencia.length > 0,
        litispendencia: arrayLitispendencia
    } 
}