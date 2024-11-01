import { getEmpregoSislabra } from "./SislabraBusiness/GetEmpregoSislabra";
import { getImoveisRurais } from "./SislabraBusiness/GetImoveisRuraisSislabra";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";
import { getEmpresa } from "./SislabraBusiness/GetEmpresaSislabra";
import { IImpedimentos } from "../../../DTO/IResponseSislabra";

export class GetDocumentSislabraFromSapiens {
    async execute(paginaformatada: string, indentificadorDocumento: string): Promise<{ impedimentos: string, objImpedimentos: IImpedimentos }> {

       try {
        let response: string = "";

        const ObjImpedimentos: IImpedimentos = {
            veiculos: [],
            empregos: [],
            imoveisRurais: [],
            empresas: [],
        };

        const GetVeiculosSislabra = await getVeiculos(paginaformatada);
        if(!(GetVeiculosSislabra.length == 2 && GetVeiculosSislabra[0].tipo == "MOTOCICLETA" && GetVeiculosSislabra[1].tipo == "MOTOCICLETA" || 
        GetVeiculosSislabra.length == 1 && GetVeiculosSislabra[0].tipo == "MOTOCICLETA"
        )){
            if(GetVeiculosSislabra.length !== 0 && indentificadorDocumento == 'AUTOR'){
                response = response + " VEICULO AUTOR -";
                ObjImpedimentos.veiculos = GetVeiculosSislabra;
            }else if(GetVeiculosSislabra.length !== 0 && indentificadorDocumento == 'CONJUGE'){
                response = response + " VEICULO CONJUGE -";
                ObjImpedimentos.veiculos = GetVeiculosSislabra;
            }
        }

        const GetEmpregoSislabra = await getEmpregoSislabra(paginaformatada);
        if(GetEmpregoSislabra.length !== 0 && indentificadorDocumento == 'AUTOR'){
            response = response + " EMPREGO AUTOR -";
            ObjImpedimentos.empregos = GetEmpregoSislabra;
        }else if(GetEmpregoSislabra.length !== 0 && indentificadorDocumento == 'CONJUGE'){
            response = response + " EMPREGO CONJUGE -";
            ObjImpedimentos.empregos = GetEmpregoSislabra;
        }

        const GetImoveisRuraisSislabra = await getImoveisRurais(paginaformatada);
        if(GetImoveisRuraisSislabra.length !== 0 && indentificadorDocumento == 'AUTOR'){
            response = response + " IMOVEIS RURAIS AUTOR -";
            ObjImpedimentos.imoveisRurais = GetImoveisRuraisSislabra;
        }else if(GetImoveisRuraisSislabra.length !== 0 && indentificadorDocumento == 'CONJUGE'){
            response = response + " IMOVEIS RURAIS CONJUGE -";
            ObjImpedimentos.imoveisRurais = GetImoveisRuraisSislabra;
        }

        const GetEmpresaSislabra = await getEmpresa(paginaformatada)
        if(GetEmpresaSislabra.length !== 0 && indentificadorDocumento == 'AUTOR'){
            response = response + " EMPRESA AUTOR -";
            ObjImpedimentos.empresas = GetEmpresaSislabra;
        }else if(GetEmpresaSislabra.length !== 0 && indentificadorDocumento == 'CONJUGE'){
            response = response + " EMPRESA CONJUGE -";
            ObjImpedimentos.empresas = GetEmpresaSislabra;
        }

        return { impedimentos: response, objImpedimentos: ObjImpedimentos }

       }catch(e){
        console.error("Erro ao buscar sislabra" + e)
    }
        
    }
}