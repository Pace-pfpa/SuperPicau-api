import { Emprego, Empresa, ImovelRural, Veiculo } from "../..";

export interface IImpedimentosLoas {
    nome: string;
    identificacao: string;
    impeditivos: {
        veiculos: Veiculo[];
        empregos: Emprego[];
        imoveisRurais: ImovelRural[];
        empresas: Empresa[];
        bensTSE: string | null;
        imoveisSP: string | null;
        embarcacao: string | null;
        aeronave: string | null;
        doacaoEleitoral: string | null;
    }
}
