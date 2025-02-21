import { IFichaSintetica } from "./IFichaSintetica";
import { IProcessosMovidos } from "./IProcessosMovidos";
import { IRelacaoPrevidenciaria } from "./IRelacaoPrevidenciaria";
import { IRequerimentos } from "./IRequerimentos";

export interface IDossieExtractedPartial {
    fichaSintetica: IFichaSintetica;
    processosMovidos: IProcessosMovidos[];
    requerimentos: IRequerimentos[];
    relacoesPrevidenciarias: IRelacaoPrevidenciaria[];
}
