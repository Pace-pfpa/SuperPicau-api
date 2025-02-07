import { IImpedimentosRural } from "./rural/IImpedimentosRural";

export interface IImpedimentosLoas extends IImpedimentosRural {
    doacaoEleitoral: string | null;
}
