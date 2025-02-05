import { IImpedimentos } from "./rural/IImpedimentosRural";

export interface IImpedimentosLoas extends IImpedimentos {
    doacaoEleitoral: string | null;
}
