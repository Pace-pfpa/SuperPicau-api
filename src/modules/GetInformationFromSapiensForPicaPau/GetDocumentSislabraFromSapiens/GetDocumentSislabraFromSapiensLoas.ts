import { getImoveisRurais } from "./SislabraBusiness/GetImoveisRuraisSislabra";
import { getImoveisSP } from "./SislabraBusiness/GetImoveisSp";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";
import { getEmpresa } from "./SislabraBusiness/GetEmpresaSislabra";
import { getBensTSE } from "./SislabraBusiness/GetBensTSE";
import { getEmbarcacoes } from "./SislabraBusiness/GetEmbarcacoesSislabra";
import { getAeronaves } from "./SislabraBusiness/GetAeronavesSislabra";
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getDoacaoEleitoral } from "./SislabraBusiness/GetDoacaoEleitoral";
import { IImpedimentosLoas } from "../dto/Sislabra/interfaces/IImpedimentosLoas";

export class GetDocumentSislabraFromSapiensLoas {
    async execute(paginaformatada: JSDOMType, isPoloAtivo: boolean): Promise<{ impedimentos: string, objImpedimentos: IImpedimentosLoas }> {
       try{
        let response = "";

        const ObjImpedimentos: IImpedimentosLoas = {
            veiculos: [],
            empregos: [],
            imoveisRurais: [],
            empresas: [],
            bensTSE: null,
            imoveisSP: null,
            embarcacao: null,
            aeronave: null,
            doacaoEleitoral: null
        };
        
        const GetEmpresaSislabra = await getEmpresa(paginaformatada);
        if(GetEmpresaSislabra.length !== 0 && isPoloAtivo) {
            response += " EMPRESA -"
            ObjImpedimentos.empresas = GetEmpresaSislabra;
        } else if (GetEmpresaSislabra.length !== 0 && !isPoloAtivo) {
            response += " EMPRESA GF -"
            ObjImpedimentos.empresas = GetEmpresaSislabra;
        }

        const GetBensTSE = await getBensTSE(paginaformatada);
        if (GetBensTSE && isPoloAtivo) {
            response += " BENS TSE -"
            ObjImpedimentos.bensTSE = "BENS ENCONTRADOS NO AUTOR";
        } else if (GetBensTSE && !isPoloAtivo) {
            response += " BENS TSE GF -"
            ObjImpedimentos.bensTSE = "BENS ENCONTRADOS NO GRUPO FAMILIAR";
        }

        const GetVeiculosSislabra = await getVeiculos(paginaformatada);
        if(!(GetVeiculosSislabra.length == 2 && GetVeiculosSislabra[0].tipo == "MOTOCICLETA" && GetVeiculosSislabra[1].tipo == "MOTOCICLETA" || 
        GetVeiculosSislabra.length == 1 && GetVeiculosSislabra[0].tipo == "MOTOCICLETA"
        )){
            if(GetVeiculosSislabra.length != 0 && isPoloAtivo){
                response += " VEÍCULOS -";
                ObjImpedimentos.veiculos = GetVeiculosSislabra;
            } else if (GetVeiculosSislabra.length != 0 && !isPoloAtivo) {
                response += " VEÍCULOS GF -"
                ObjImpedimentos.veiculos = GetVeiculosSislabra;
            }
        }

        const GetImoveisSP = await getImoveisSP(paginaformatada);
        if (GetImoveisSP && isPoloAtivo) {
            response += " IMÓVEL SP -"
            ObjImpedimentos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO AUTOR";
        } else if (GetImoveisSP && !isPoloAtivo) {
            response += " IMÓVEL SP GF -"
            ObjImpedimentos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO GRUPO FAMILIAR";
        }

        const GetImoveisRuraisSislabra = await getImoveisRurais(paginaformatada);
        if (GetImoveisRuraisSislabra.length !== 0 && isPoloAtivo) {
            response += " IMÓVEL RURAL -";
            ObjImpedimentos.imoveisRurais = GetImoveisRuraisSislabra;
        } else if(GetImoveisRuraisSislabra.length !== 0 && !isPoloAtivo) {
            response += " IMÓVEL RURAL GF -";
            ObjImpedimentos.imoveisRurais = GetImoveisRuraisSislabra;
        }
        

        const GetEmbarcacao = await getEmbarcacoes(paginaformatada);
        if (GetEmbarcacao && isPoloAtivo) {
            response += " EMBARCAÇÃO -"
            ObjImpedimentos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO AUTOR";
        } else if (GetEmbarcacao && !isPoloAtivo) {
            response += " EMBARCAÇÃO GF -"
            ObjImpedimentos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO GEUPO FAMILIAR";
        }


        const GetAeronave = await getAeronaves(paginaformatada);
        if (GetAeronave && isPoloAtivo) {
            response += " AERONAVE -";
            ObjImpedimentos.aeronave = "AERONAVE ENCONTRADA NO AUTOR";
        } else if (GetAeronave && !isPoloAtivo) {
            response += " AERONAVE GF -";
            ObjImpedimentos.aeronave = "AERONAVE ENCONTRADA NO GRUPO FAMILIAR";
        }

        const GetDoacaoEleitoral = await getDoacaoEleitoral(paginaformatada);
        if (GetDoacaoEleitoral && isPoloAtivo) {
            response += " DOAÇÃO ELEITORAL -";
            ObjImpedimentos.doacaoEleitoral = "DOAÇÃO ELEITORAL ENCONTRADA NO AUTOR";
        } else if (GetDoacaoEleitoral && !isPoloAtivo) {
            response += " DOAÇÃO ELEITORAL GF -";
            ObjImpedimentos.doacaoEleitoral = "DOAÇÃO ELEITORAL ENCONTRADA NO GRUPO FAMILIAR";
        }

        return { impedimentos: response, objImpedimentos: ObjImpedimentos }


       }catch(e){
            console.error("ERRO AO LER O SISLABRA AUTOR");
       }
    }
}