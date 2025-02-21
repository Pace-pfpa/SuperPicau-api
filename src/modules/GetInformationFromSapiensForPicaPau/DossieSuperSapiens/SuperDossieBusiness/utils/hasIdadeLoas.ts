import { IIdadeLoas } from "../../../BuscarImpedimentos/dtos/interfaces/IIdadeLoas";
import { IRequerimentos } from "../../../BuscarImpedimentos/dtos/interfaces/IRequerimentos";
import { calcularIdadeIdoso } from "../../../loas/Business/Help/CalcularIdadeIdoso";
import { getRequerimentoMaisAtual } from "./getRequerimentoMaisAtual.util";

export function hasIdadeLoas(
    dataDeNascimento: string,
    requerimentos: IRequerimentos[]
): IIdadeLoas {
    const requerimentoMaisAtual = getRequerimentoMaisAtual(requerimentos);

    if (!requerimentoMaisAtual.beneficio.startsWith("88")) {
        return {
            idadeImpeditivo: false,
        }
    }

    let dataRequerimentoMaisAtual: string;
    if (requerimentoMaisAtual.status === 'INDEFERIDO') {
        dataRequerimentoMaisAtual = requerimentoMaisAtual.der;
    } else {
        dataRequerimentoMaisAtual = requerimentoMaisAtual.dataCessacao;
    }

    const idade = calcularIdadeIdoso(dataDeNascimento, dataRequerimentoMaisAtual)

    if (idade < 65) {
        return {
            idadeImpeditivo: true,
            idadeAutor: {
                dataAjuizamento: dataRequerimentoMaisAtual,
                dataNascimento: dataDeNascimento,
                idade: idade
            }
        }
    }

    return {
        idadeImpeditivo: false,
    }
}
