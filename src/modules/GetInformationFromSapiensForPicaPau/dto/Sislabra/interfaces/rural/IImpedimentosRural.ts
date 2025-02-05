import { Emprego } from "../../types/EmpregoType";
import { Empresa } from "../../types/EmpresaType";
import { ImovelRural } from "../../types/ImovelRuralType";
import { Veiculo } from "../../types/VeiculoType";

export interface IImpedimentosRural {
    veiculos: Veiculo[];
    empregos: Emprego[];
    imoveisRurais: ImovelRural[];
    empresas: Empresa[];
    bensTSE: string | null;
    imoveisSP: string | null;
    embarcacao: string | null;
    aeronave: string | null;
}