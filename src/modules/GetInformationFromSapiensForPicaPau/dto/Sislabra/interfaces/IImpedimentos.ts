import { Emprego } from "../types/EmpregoType";
import { Empresa } from "../types/EmpresaType";
import { ImovelRural } from "../types/ImovelRuralType";
import { Veiculo } from "../types/VeiculoType";

export interface IImpedimentos {
    veiculos: Veiculo[];
    empregos: Emprego[];
    imoveisRurais: ImovelRural[];
    empresas: Empresa[];
}