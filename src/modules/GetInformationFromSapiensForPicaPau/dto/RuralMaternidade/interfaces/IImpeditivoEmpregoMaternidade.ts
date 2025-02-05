import { EmpregoDP } from "../types/EmpregoDPType";

export interface IImpeditivoEmpregoMaternidade {
    haveImpeditivo: boolean;
    isVinculoAberto?: boolean;
    empregos?: EmpregoDP[];
}