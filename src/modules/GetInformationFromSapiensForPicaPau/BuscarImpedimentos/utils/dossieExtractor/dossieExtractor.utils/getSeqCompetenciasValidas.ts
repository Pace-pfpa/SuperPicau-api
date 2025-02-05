import { IRelacaoPrevidenciaria } from "../../../dtos/interfaces/IRelacaoPrevidenciaria";
import { IRequerimentos } from "../../../dtos/interfaces/IRequerimentos";

export function getSeqCompetenciasValidas(cessados: IRequerimentos[], relacoes: IRelacaoPrevidenciaria[]): string[] {
    const arraySeqs: string[] = [];
    for (const req of cessados) {
        const result = relacoes.find((rel) => rel.nb === req.numeroBeneficio);

        if (result) arraySeqs.push(result.seq);
    }

    return arraySeqs;
}