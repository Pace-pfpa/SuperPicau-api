import { getEmpregoSislabra } from "./SislabraBusiness/GetEmpregoSislabra";
import { getImoveisRurais } from "./SislabraBusiness/GetImoveisRuraisSislabra";
import { getImoveis } from "./SislabraBusiness/GetImoveisSp";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";
import { getEmpresa } from "./SislabraBusiness/GetEmpresaSislabra";


export class GetDocumentSislabraFromSapiens{
    async execute(paginaformatada: string, indentificadorDocumento: string): Promise<string>{
       try{
        let response = "";

        const GetVeiculosSislabra = await getVeiculos(paginaformatada)
        if(!(GetVeiculosSislabra.length == 2 && GetVeiculosSislabra[0].tipo == "MOTOCICLETA" && GetVeiculosSislabra[1].tipo == "MOTOCICLETA" || 
        GetVeiculosSislabra.length == 1 && GetVeiculosSislabra[0].tipo == "MOTOCICLETA"
        )){
            if(GetVeiculosSislabra.length != 0 && indentificadorDocumento == 'AUTOR'){
                response = response + " VEICULO AUTOR -"
            }else if(GetVeiculosSislabra.length != 0 && indentificadorDocumento == 'CONJUGE'){
                response = response + " VEICULO CONJUGE -"
            }
        }
        
        const GetEmpregoSislabra = await getEmpregoSislabra(paginaformatada);
        if(GetEmpregoSislabra && indentificadorDocumento == 'AUTOR'){
            response = response + " EMPREGO AUTOR -"
        }else if(GetEmpregoSislabra && indentificadorDocumento == 'CONJUGE'){
            response = response + " EMPREGO CONJUGE -"
        }

        const GetImoveisRuraisSislabra = await getImoveisRurais(paginaformatada);
        if(GetImoveisRuraisSislabra && indentificadorDocumento == 'AUTOR'){
            response = response + " IMOVEIS RURAIS AUTOR -"
        }else if(GetImoveisRuraisSislabra && indentificadorDocumento == 'CONJUGE'){
            response = response + " IMOVEIS RURAIS CONJUGE -"
        }

        const GetEmpresaSislabra = await getEmpresa(paginaformatada)
        if(GetEmpresaSislabra && indentificadorDocumento == 'AUTOR'){
            //console.log("GetEmpresaSislabra: ", GetEmpresaSislabra)
            response = response + " EMPRESA AUTOR -"
        }else if(GetEmpresaSislabra && indentificadorDocumento == 'CONJUGE'){
            //console.log("GetEmpresaSislabra: ", GetEmpresaSislabra)
            response = response + " EMPRESA CONJUGE -"
        }

        return response


       }catch(e){
            console.log ("ERRO AO LER O SISLABRA AUTOR")
         return `ERRO AO LER O SISLABRA AUTOR`
       }
        
    }
}