import { IImpedimentosLoas } from "./IImpedimentosLoas";

export interface IResponseSislabraLoas {
    impedimentos: string[];
    autor: IImpedimentosLoas;
    gf: IImpedimentosLoas[];
}