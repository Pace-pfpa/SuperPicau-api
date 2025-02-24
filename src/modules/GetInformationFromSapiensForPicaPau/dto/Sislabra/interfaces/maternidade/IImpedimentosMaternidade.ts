import { Empresa } from "../../types/EmpresaType";
import { ImovelRural } from "../../types/ImovelRuralType";
import { Veiculo } from "../../types/VeiculoType";

export interface IImpedimentosMaternidade {
    nome: string;
    identificacao: string;
    impeditivos: {
        veiculos: Veiculo[];
        empresas: Empresa[];
        imoveisRurais: ImovelRural[];
        bensTSE: string | null;
        imoveisSP: string | null;
        embarcacao: string | null;
        aeronave: string | null;
    }
}