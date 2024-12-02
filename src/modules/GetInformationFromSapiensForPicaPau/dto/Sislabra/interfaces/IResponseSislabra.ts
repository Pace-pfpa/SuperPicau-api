import { IImpedimentos } from "./IImpedimentos";

export interface IResponseSislabra {
    impedimentos: string[];
    autor: IImpedimentos;
    conjuge: IImpedimentos;
}