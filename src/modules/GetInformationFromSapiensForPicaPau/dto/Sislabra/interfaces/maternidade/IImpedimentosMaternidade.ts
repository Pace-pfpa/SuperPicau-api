import { Empresa } from "../../types/EmpresaType";
import { ImovelRural } from "../../types/ImovelRuralType";
import { Veiculo } from "../../types/VeiculoType";

export interface IImpedimentosMaternidade {
    empresas: Empresa[];
    bensTSE: string | null;
    veiculos: Veiculo[];
    imoveisSP: string | null;
    imoveisRurais: ImovelRural[];
    embarcacao: string | null;
    aeronave: string | null;
}