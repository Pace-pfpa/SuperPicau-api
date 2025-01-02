import { getImoveisRurais } from "./SislabraBusiness/GetImoveisRuraisSislabra";
import { getImoveisSP } from "./SislabraBusiness/GetImoveisSp";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";
import { getEmpresa } from "./SislabraBusiness/GetEmpresaSislabra";
import { getBensTSE } from "./SislabraBusiness/GetBensTSE";
import { getEmbarcacoes } from "./SislabraBusiness/GetEmbarcacoesSislabra";
import { getAeronaves } from "./SislabraBusiness/GetAeronavesSislabra";
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { IImpedimentos } from "../dto";

export class GetDocumentSislabraFromSapiensLoas {
    async execute(paginaformatada: JSDOMType, isPoloAtivo: boolean): Promise<{ impedimentos: string, objImpedimentos: any }> {
       try{
        let response = "";

        const ObjImpedimentos: IImpedimentos = {
            veiculos: [],
            empregos: [],
            imoveisRurais: [],
            empresas: [],
            bensTSE: null,
            imoveisSP: null,
            embarcacao: null,
            aeronave: null
        };
        
        const GetEmpresaSislabra = await getEmpresa(paginaformatada)
        if(GetEmpresaSislabra && isPoloAtivo) {
            response += " EMPRESA -"
        } else if (GetEmpresaSislabra && !isPoloAtivo) {
            response += " EMPRESA GF -"
        }

        const GetBensTSE = await getBensTSE(paginaformatada)
        if (GetBensTSE && isPoloAtivo) {
            response += " BENS TSE -"
        } else if (GetBensTSE && !isPoloAtivo) {
            response += " BENS TSE GF -"
        }

        const GetVeiculosSislabra = await getVeiculos(paginaformatada)
        if(!(GetVeiculosSislabra.length == 2 && GetVeiculosSislabra[0].tipo == "MOTOCICLETA" && GetVeiculosSislabra[1].tipo == "MOTOCICLETA" || 
        GetVeiculosSislabra.length == 1 && GetVeiculosSislabra[0].tipo == "MOTOCICLETA"
        )){
            if(GetVeiculosSislabra.length != 0 && isPoloAtivo){
                response += " VEÍCULOS -"
            } else if (GetVeiculosSislabra.length != 0 && !isPoloAtivo) {
                response += " VEÍCULOS GF -"
            }
        }

        const GetImoveisSP = await getImoveisSP(paginaformatada)
        if (GetImoveisSP && isPoloAtivo) {
            response += " IMÓVEL SP -"
        } else if (GetImoveisSP && !isPoloAtivo) {
            response += " IMÓVEL SP GF -"
        }

        const GetImoveisRuraisSislabra = await getImoveisRurais(paginaformatada);
        if (GetImoveisRuraisSislabra && isPoloAtivo){
            response += " IMÓVEL RURAL -"
        } else if(GetImoveisRuraisSislabra && !isPoloAtivo){
            response += " IMÓVEL RURAL GF -"
        }
        

        const GetEmbarcacao = await getEmbarcacoes(paginaformatada)
        if (GetEmbarcacao && isPoloAtivo) {
            response += " EMBARCAÇÃO -"
        } else if (GetEmbarcacao && !isPoloAtivo) {
            response += " EMBARCAÇÃO GF -"
        }


        const GetAeronave = await getAeronaves(paginaformatada)
        if (GetAeronave && !isPoloAtivo) {
            response += " AERONAVE -"
        } else if (GetAeronave && isPoloAtivo) {
            response += " AERONAVE GF -"
        }

        return response


       }catch(e){
            console.log ("ERRO AO LER O SISLABRA AUTOR")
         return `ERRO AO LER O SISLABRA AUTOR`
       }
        
    }
}