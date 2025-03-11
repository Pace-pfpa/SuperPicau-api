import { Empresa, ImovelRural, Veiculo } from "../../GetInformationFromSapiensForPicaPau/dto";

export type CobrancaLabras = {
    nome: string;
    impeditivos: {
        empresas: Empresa[];
        bensTSE: string | null;
        veiculos: Veiculo[];
        imoveisSP: string | null;
        imoveisRurais: ImovelRural[];
        embarcacao: string | null;
        aeronave: string | null;
    }
}
