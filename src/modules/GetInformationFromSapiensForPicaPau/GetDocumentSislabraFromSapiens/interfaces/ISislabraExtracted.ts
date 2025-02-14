import { Empresa, ImovelRural, Veiculo } from "../../dto";

export interface ISislabraExtracted {
    nome: string;
    identificacao: string,
    veiculos: Veiculo[] | null;
    imoveisRurais: ImovelRural[] | null;
    empresas: Empresa[] | null;
    bensTse: boolean;
    imoveisSp: boolean;
    embarcacao: boolean;
    aeronave: boolean;
}