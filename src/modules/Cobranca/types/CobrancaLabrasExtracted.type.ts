import { Empresa, ImovelRural, Veiculo } from "../../GetInformationFromSapiensForPicaPau/dto";

export type CobrancaLabrasExtracted = {
    nome: string;
    empresas: Empresa[] | null;
    bensTse: boolean;
    veiculos: Veiculo[] | null;
    imoveisSp: boolean;
    imoveisRurais: ImovelRural[] | null;
    embarcacao: boolean;
    aeronave: boolean;
}
