import { IImpedimentos } from "./IImpedimentos";

export interface IImpedimentosLoas extends IImpedimentos {
    doacaoEleitoral: string | null;
}
