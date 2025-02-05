import { IImpedimentosRural } from "./IImpedimentosRural";

export interface IResponseSislabraRural {
    impedimentos: string[];
    autor: IImpedimentosRural;
    conjuge: IImpedimentosRural;
}