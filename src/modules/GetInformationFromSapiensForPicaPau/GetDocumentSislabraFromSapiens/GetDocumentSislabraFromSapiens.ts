import { getEmpregoSislabra } from "./SislabraBusiness/GetEmpregoSislabra";
import { getImoveisRurais } from "./SislabraBusiness/GetImoveisRuraisSislabra";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";
import { getEmpresa } from "./SislabraBusiness/GetEmpresaSislabra";
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { IImpedimentos } from "../dto";
import { getBensTSE } from "./SislabraBusiness/GetBensTSE";
import { getImoveisSP } from "./SislabraBusiness/GetImoveisSp";
import { getEmbarcacoes } from "./SislabraBusiness/GetEmbarcacoesSislabra";
import { getAeronaves } from "./SislabraBusiness/GetAeronavesSislabra";

export class GetDocumentSislabraFromSapiens {
    async execute(paginaformatada: JSDOMType, indentificadorDocumento: string): Promise<{ impedimentos: string, objImpedimentos: IImpedimentos }> {

       try {
        let response: string = "";

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

        const GetBensTSE = await getBensTSE(paginaformatada)
        if (GetBensTSE && indentificadorDocumento == 'AUTOR') {
            response += " BENS TSE AUTOR -";
            ObjImpedimentos.bensTSE = "BENS ENCONTRADOS NO AUTOR";
        } else if (GetBensTSE && indentificadorDocumento == 'CONJUGE') {
            response += " BENS TSE CONJUGE -"
            ObjImpedimentos.bensTSE = "BENS ENCONTRADOS NO CONJUGE";
        }

        const GetImoveisSP = await getImoveisSP(paginaformatada)
        if (GetImoveisSP && indentificadorDocumento == 'AUTOR') {
            response += " IMÓVEL SP AUTOR -"
            ObjImpedimentos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO AUTOR";
        } else if (GetImoveisSP && indentificadorDocumento == 'CONJUGE') {
            response += " IMÓVEL SP CONJUGE -"
            ObjImpedimentos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO CONJUGE";
        }

        const GetEmbarcacao = await getEmbarcacoes(paginaformatada)
        if (GetEmbarcacao && indentificadorDocumento == 'AUTOR') {
            response += " EMBARCAÇÃO AUTOR -"
            ObjImpedimentos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO AUTOR";
        } else if (GetEmbarcacao && indentificadorDocumento == 'CONJUGE') {
            response += " EMBARCAÇÃO CONJUGE -"
            ObjImpedimentos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO CONJUGE";
        }

        const GetAeronave = await getAeronaves(paginaformatada)
        if (GetAeronave && indentificadorDocumento == 'AUTOR') {
            response += " AERONAVE AUTOR -"
            ObjImpedimentos.aeronave = "AERONAVE ENCONTRADA NO AUTOR";
        } else if (GetAeronave && indentificadorDocumento == 'CONJUGE') {
            response += " AERONAVE CONJUGE -"
            ObjImpedimentos.aeronave = "AERONAVE ENCONTRADA NO CONJUGE";
        }

        return { impedimentos: response, objImpedimentos: ObjImpedimentos }

       }catch(e){
        console.error("Erro ao buscar sislabra" + e)
        }
        
    }
}