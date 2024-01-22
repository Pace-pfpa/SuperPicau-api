import { getEmpregoSislabra } from "./SislabraBusiness/GetEmpregoSislabra";
import { getImoveisRurais } from "./SislabraBusiness/GetImoveisRuraisSislabra";
import { getImoveis } from "./SislabraBusiness/GetImoveisSp";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";


export class GetDocumentSislabraFromSapiens{
    async execute(paginaformatada: string, indentificadorDocumento: string): Promise<string>{
       try{
        let response = "";

        const GetVeiculosSislabra = await getVeiculos(paginaformatada)
        if(GetVeiculosSislabra.length != 0 && indentificadorDocumento == 'AUTOR'){
            response = response + " VEICULO AUTOR -"
        }else if(GetVeiculosSislabra.length != 0 && indentificadorDocumento == 'CONJUGE'){
            response = response + " VEICULO CONJUGE -"
        }
        
        const GetEmpregoSislabra = await getEmpregoSislabra(paginaformatada);
        if(GetEmpregoSislabra && indentificadorDocumento == 'AUTOR'){
            response = response + " EMPREGO SISLABRA AUTOR -"
        }else if(GetEmpregoSislabra && indentificadorDocumento == 'CONJUGE'){
            response = response + " EMPREGO SISLABRA CONJUGE -"
        }

        const GetImoveisRuraisSislabra = await getImoveisRurais(paginaformatada);
        if(GetImoveisRuraisSislabra && indentificadorDocumento == 'AUTOR'){
            response = response + " IMOVEIS RURAIS AUTOR -"
        }else if(GetImoveisRuraisSislabra && indentificadorDocumento == 'CONJUGE'){
            response = response + " IMOVEIS RURAIS CONJUGE -"
        }

        return response


       }catch(e){
         return `ERRO AO LE O SISLABRA AUTOR`
       }
        
    }
}