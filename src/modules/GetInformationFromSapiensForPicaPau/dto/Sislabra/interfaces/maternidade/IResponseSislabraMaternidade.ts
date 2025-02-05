import { IImpedimentosMaternidade } from "./IImpedimentosMaternidade";

export interface IResponseSislabraMaternidade {
    impedimentos: string[];
    autor: IImpedimentosMaternidade;
    conjuge: IImpedimentosMaternidade;
}