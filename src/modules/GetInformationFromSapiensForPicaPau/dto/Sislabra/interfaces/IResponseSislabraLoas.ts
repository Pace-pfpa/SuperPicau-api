import { IImpedimentos } from "./IImpedimentos";

export interface IResponseSislabraLoas {
    impedimentos: string[];
    autor: IImpedimentos;
    gf: IImpedimentos[];
}