import { getEmpregoSislabra } from "./SislabraBusiness/GetEmpregoSislabra";
import { getImoveisRurais } from "./SislabraBusiness/GetImoveisRuraisSislabra";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";
import { getEmpresa } from "./SislabraBusiness/GetEmpresaSislabra";
import { IImpedimentos, IResponseSislabra } from "../../../DTO/IResponseSislabra";


export class GetDocumentSislabraFromSapiens{
    async execute(paginaformatada: string, indentificadorDocumento: string): Promise<string>{

       try{
        let response = "";

        const impedimentosAutor: IImpedimentos = {
            veiculos: [],
            empregos: [],
            imoveisRurais: [],
            empresas: [],
        };

        const impedimentosConjuge: IImpedimentos = {
            veiculos: [],
            empregos: [],
            imoveisRurais: [],
            empresas: [],
        };

        const GetVeiculosSislabra = await getVeiculos(paginaformatada);
        if(!(GetVeiculosSislabra.length == 2 && GetVeiculosSislabra[0].Tipo == "MOTOCICLETA" && GetVeiculosSislabra[1].Tipo == "MOTOCICLETA" || 
        GetVeiculosSislabra.length == 1 && GetVeiculosSislabra[0].Tipo == "MOTOCICLETA"
        )){
            if(GetVeiculosSislabra.length != 0 && indentificadorDocumento == 'AUTOR'){
                response = response + " VEICULO AUTOR -"
                impedimentosAutor.veiculos = GetVeiculosSislabra;
            }else if(GetVeiculosSislabra.length != 0 && indentificadorDocumento == 'CONJUGE'){
                response = response + " VEICULO CONJUGE -"
                impedimentosConjuge.veiculos = GetVeiculosSislabra;
            }
        }
        
        const GetEmpregoSislabra = await getEmpregoSislabra(paginaformatada);
        if(GetEmpregoSislabra.length !== 0 && indentificadorDocumento == 'AUTOR'){
            response = response + " EMPREGO AUTOR -"
            impedimentosAutor.empregos = GetEmpregoSislabra;
        }else if(GetEmpregoSislabra.length !== 0 && indentificadorDocumento == 'CONJUGE'){
            response = response + " EMPREGO CONJUGE -"
            impedimentosConjuge.empregos = GetEmpregoSislabra;
        }

        const GetImoveisRuraisSislabra = await getImoveisRurais(paginaformatada);
        if(GetImoveisRuraisSislabra && indentificadorDocumento == 'AUTOR'){
            response = response + " IMOVEIS RURAIS AUTOR -"
        }else if(GetImoveisRuraisSislabra && indentificadorDocumento == 'CONJUGE'){
            response = response + " IMOVEIS RURAIS CONJUGE -"
        }

        const GetEmpresaSislabra = await getEmpresa(paginaformatada)
        if(GetEmpresaSislabra && indentificadorDocumento == 'AUTOR'){
            response = response + " EMPRESA AUTOR -"
        }else if(GetEmpresaSislabra && indentificadorDocumento == 'CONJUGE'){
            response = response + " EMPRESA CONJUGE -"
        }

        // TODO atualizar o tipo de retorno
        return response;

       }catch(e){
        console.error("Erro ao buscar sislabra" + e)
        return '';
    }
        
    }
}