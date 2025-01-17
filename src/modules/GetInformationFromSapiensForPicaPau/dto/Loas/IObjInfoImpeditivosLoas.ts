import { DetalhesRenda } from "../../BuscarImpedimentos/calculoLoas/dto/DetalhesRenda";
import { IIdadeDTO } from "../../DossieSuperSapiens/SuperDossieBusiness/CalcularIdade/dtos/IIdadeDTO";

export interface IObjInfoImpeditivosLoas {
    litispendencia: string[] | null;
    bpc: string | null;
    requerimento: string | null;
    renda: DetalhesRenda | null;
    beneficio: string | null;
    idade: IIdadeDTO | null;
}