import { IIdadeDTO } from "../../DossieSuperSapiens/SuperDossieBusiness/CalcularIdade/dtos/IIdadeDTO";

export interface IObjInfoImpeditivosLoas {
    litispendencia: string[] | null;
    bpc: string | null;
    requerimento: string | null;
    renda: string | null;
    beneficio: string | null;
    idade: IIdadeDTO | null;
}