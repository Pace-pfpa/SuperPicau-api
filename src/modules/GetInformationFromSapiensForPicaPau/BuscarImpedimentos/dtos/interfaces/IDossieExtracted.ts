import { IFichaSintetica } from "./IFichaSintetica";
import { IProcessosMovidos } from "./IProcessosMovidos";
import { IRelacaoPrevidenciaria } from "./IRelacaoPrevidenciaria";
import { IRelacaoPrevidenciariaDetalhada } from "./IRelacaoPrevidenciariaDetalhada";
import { IRequerimentos } from "./IRequerimentos";

export interface IDossieExtracted {
    fichaSintetica: IFichaSintetica;
    processosMovidos: IProcessosMovidos[];
    requerimentos: IRequerimentos[];
    relacoesPrevidenciarias: IRelacaoPrevidenciaria[];
    competenciasDetalhadas: IRelacaoPrevidenciariaDetalhada[];
}