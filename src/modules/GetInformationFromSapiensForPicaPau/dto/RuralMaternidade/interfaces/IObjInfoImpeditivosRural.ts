import { IIdadeDTO } from "../../../DossieSuperSapiens/SuperDossieBusiness/CalcularIdade/dtos/IIdadeDTO";
import { IObjInfoImpeditivosMaternidade } from "./IObjInfoImpeditivosMaternidade";

export interface IObjInfoImpeditivosRural extends IObjInfoImpeditivosMaternidade {
    idade: IIdadeDTO | null;
}