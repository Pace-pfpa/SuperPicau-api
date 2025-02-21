import { Emprego, Empresa, ImovelRural, Veiculo } from "../../dto";

export interface ISislabraExtractedLoas {
    nome: string;
    identificacao: string,
    veiculos: Veiculo[] | null;
    empregos: Emprego[] | null;
    imoveisRurais: ImovelRural[] | null;
    empresas: Empresa[] | null;
    bensTse: boolean;
    imoveisSp: boolean;
    embarcacao: boolean;
    aeronave: boolean;
    doacaoEleitoral: boolean;
}