import { IIdadeDTO } from "../../../DossieSuperSapiens/SuperDossieBusiness/CalcularIdade/dtos/IIdadeDTO";
import { IObjInfoImpeditivosMaternidade } from "./IObjInfoImpeditivos";

export interface IObjInfoImpeditivosRural extends IObjInfoImpeditivosMaternidade {
    idade: IIdadeDTO | null;
}