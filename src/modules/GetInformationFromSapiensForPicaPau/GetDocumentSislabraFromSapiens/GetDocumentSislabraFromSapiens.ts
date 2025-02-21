import { getEmpregoSislabra } from "./SislabraBusiness/GetEmpregoSislabra";
import { getImoveisRurais } from "./SislabraBusiness/GetImoveisRuraisSislabra";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";
import { getEmpresa } from "./SislabraBusiness/GetEmpresaSislabra";
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getBensTSE } from "./SislabraBusiness/GetBensTSE";
import { getImoveisSP } from "./SislabraBusiness/GetImoveisSp";
import { getEmbarcacoes } from "./SislabraBusiness/GetEmbarcacoesSislabra";
import { getAeronaves } from "./SislabraBusiness/GetAeronavesSislabra";
import { IImpedimentosMaternidade } from "../dto/Sislabra/interfaces/maternidade/IImpedimentosMaternidade";
import { IImpedimentosRural } from "../dto";
import { sislabraExtractor } from "./utils/sislabraExtractor";
import { IImpedimentosLoas } from "../dto/Sislabra/interfaces/IImpedimentosLoas";
import { sislabraExtractorLoas } from "./utils/sislabraExtractorLoas";

export class GetDocumentSislabraFromSapiens {
    async execute(
        paginaformatada: JSDOMType, 
        indentificadorDocumento: string
    ): Promise<{ impedimentos: string, objImpedimentos: IImpedimentosRural }> {

       try {
        let response: string = "";

        const ObjImpedimentos: IImpedimentosRural = {
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

        const GetEmpresaSislabra = await getEmpresa(paginaformatada);
        if(GetEmpresaSislabra.length !== 0 && indentificadorDocumento == 'AUTOR'){
            response = response + " EMPRESA AUTOR -";
            ObjImpedimentos.empresas = GetEmpresaSislabra;
        }else if(GetEmpresaSislabra.length !== 0 && indentificadorDocumento == 'CONJUGE'){
            response = response + " EMPRESA CONJUGE -";
            ObjImpedimentos.empresas = GetEmpresaSislabra;
        }

        const GetBensTSE = await getBensTSE(paginaformatada);
        if (GetBensTSE && indentificadorDocumento == 'AUTOR') {
            response += " BENS TSE AUTOR -";
            ObjImpedimentos.bensTSE = "BENS ENCONTRADOS NO AUTOR";
        } else if (GetBensTSE && indentificadorDocumento == 'CONJUGE') {
            response += " BENS TSE CONJUGE -"
            ObjImpedimentos.bensTSE = "BENS ENCONTRADOS NO CONJUGE";
        }

        const GetImoveisSP = await getImoveisSP(paginaformatada);
        if (GetImoveisSP && indentificadorDocumento == 'AUTOR') {
            response += " IMÓVEL SP AUTOR -";
            ObjImpedimentos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO AUTOR";
        } else if (GetImoveisSP && indentificadorDocumento == 'CONJUGE') {
            response += " IMÓVEL SP CONJUGE -";
            ObjImpedimentos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO CONJUGE";
        }

        const GetEmbarcacao = await getEmbarcacoes(paginaformatada);
        if (GetEmbarcacao && indentificadorDocumento == 'AUTOR') {
            response += " EMBARCAÇÃO AUTOR -";
            ObjImpedimentos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO AUTOR";
        } else if (GetEmbarcacao && indentificadorDocumento == 'CONJUGE') {
            response += " EMBARCAÇÃO CONJUGE -";
            ObjImpedimentos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO CONJUGE";
        }

        const GetAeronave = await getAeronaves(paginaformatada);
        if (GetAeronave && indentificadorDocumento == 'AUTOR') {
            response += " AERONAVE AUTOR -";
            ObjImpedimentos.aeronave = "AERONAVE ENCONTRADA NO AUTOR";
        } else if (GetAeronave && indentificadorDocumento == 'CONJUGE') {
            response += " AERONAVE CONJUGE -";
            ObjImpedimentos.aeronave = "AERONAVE ENCONTRADA NO CONJUGE";
        }

        return { impedimentos: response, objImpedimentos: ObjImpedimentos }

       } catch(e) {
            console.error("Erro ao buscar sislabra" + e)
       }
        
    }

    async maternidade(
        paginaformatada: JSDOMType, 
        indentificadorDocumento: string
    ): Promise<{ 
        impedimentos: string, 
        objImpedimentos: IImpedimentosMaternidade
    }> {
        try {
            let response: string = "";
    
            const ObjImpedimentos: IImpedimentosMaternidade = {
                nome: '',
                identificacao: '',
                impeditivos: {
                    veiculos: [],
                    imoveisRurais: [],
                    empresas: [],
                    bensTSE: null,
                    imoveisSP: null,
                    embarcacao: null,
                    aeronave: null
                }
            };

            if (indentificadorDocumento === 'AUTOR') {
                const sislabra = await sislabraExtractor(paginaformatada, indentificadorDocumento)
                ObjImpedimentos.nome = sislabra.nome;
                ObjImpedimentos.identificacao = 'AUTOR';

                if (sislabra.veiculos) {
                    response += " VEICULO AUTOR -";
                    ObjImpedimentos.impeditivos.veiculos = sislabra.veiculos;
                }

                if (sislabra.imoveisRurais) {
                    response += " IMOVEIS RURAIS AUTOR -";
                    ObjImpedimentos.impeditivos.imoveisRurais = sislabra.imoveisRurais;
                }

                if (sislabra.empresas) {
                    response += " EMPRESA AUTOR -";
                    ObjImpedimentos.impeditivos.empresas = sislabra.empresas;
                }

                if (sislabra.bensTse) {
                    response += " BENS TSE AUTOR -";
                    ObjImpedimentos.impeditivos.bensTSE = "BENS ENCONTRADOS NO AUTOR";
                }

                if (sislabra.imoveisSp) {
                    response += " IMÓVEL SP AUTOR -";
                    ObjImpedimentos.impeditivos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO AUTOR";
                }

                if (sislabra.embarcacao) {
                    response += " EMBARCAÇÃO AUTOR -";
                    ObjImpedimentos.impeditivos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO AUTOR";
                }

                if (sislabra.aeronave) {
                    response += " AERONAVE AUTOR -";
                    ObjImpedimentos.impeditivos.aeronave = "AERONAVE ENCONTRADA NO AUTOR";
                }
            } else {
                const sislabra = await sislabraExtractor(paginaformatada, indentificadorDocumento);
                ObjImpedimentos.nome = sislabra.nome;
                ObjImpedimentos.identificacao = 'CONJUGE';

                if (sislabra.veiculos) {
                    response += " VEICULO CONJUGE -";
                    ObjImpedimentos.impeditivos.veiculos = sislabra.veiculos;
                }

                if (sislabra.imoveisRurais) {
                    response += " IMOVEIS RURAIS CONJUGE -";
                    ObjImpedimentos.impeditivos.imoveisRurais = sislabra.imoveisRurais;
                }

                if (sislabra.empresas) {
                    response += " EMPRESA CONJUGE -";
                    ObjImpedimentos.impeditivos.empresas = sislabra.empresas;
                }

                if (sislabra.bensTse) {
                    response += " BENS TSE CONJUGE -";
                    ObjImpedimentos.impeditivos.bensTSE = "BENS ENCONTRADOS NO CONJUGE";
                }

                if (sislabra.imoveisSp) {
                    response += " IMÓVEL SP CONJUGE -";
                    ObjImpedimentos.impeditivos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO CONJUGE";
                }

                if (sislabra.embarcacao) {
                    response += " EMBARCAÇÃO CONJUGE -";
                    ObjImpedimentos.impeditivos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO CONJUGE";
                }

                if (sislabra.aeronave) {
                    response += " AERONAVE CONJUGE -";
                    ObjImpedimentos.impeditivos.aeronave = "AERONAVE ENCONTRADA NO CONJUGE";
                }
            }
    
            return { impedimentos: response, objImpedimentos: ObjImpedimentos }
    
           } catch(e) {
                console.error("Erro ao buscar sislabra" + e.message)
           }
    }

    async loas(
        paginaformatada: JSDOMType, 
        isPoloAtivo: boolean
    ): Promise<{ 
        impedimentos: string, 
        objImpedimentos: IImpedimentosLoas 
    }> {
        try {
            let response: string = '';

            const objImpedimentos:IImpedimentosLoas = {
                nome: '',
                identificacao: '',
                impeditivos: {
                    empregos: [],
                    veiculos: [],
                    imoveisRurais: [],
                    empresas: [],
                    bensTSE: null,
                    imoveisSP: null,
                    embarcacao: null,
                    aeronave: null,
                    doacaoEleitoral: null
                }
            }

            if (isPoloAtivo) {
                const sislabra = await sislabraExtractorLoas(paginaformatada, isPoloAtivo);
                objImpedimentos.nome = sislabra.nome;
                objImpedimentos.identificacao = sislabra.identificacao;

                if (sislabra.veiculos) {
                    response += " VEÍCULOS -";
                    objImpedimentos.impeditivos.veiculos = sislabra.veiculos;
                }

                if (sislabra.empregos) {
                    response += " EMPREGO -";
                    objImpedimentos.impeditivos.empregos = sislabra.empregos;
                }

                if (sislabra.imoveisRurais) {
                    response += " IMÓVEL RURAL -";
                    objImpedimentos.impeditivos.imoveisRurais = sislabra.imoveisRurais;
                }

                if (sislabra.empresas) {
                    response += " EMPRESA -";
                    objImpedimentos.impeditivos.empresas = sislabra.empresas;
                }

                if (sislabra.bensTse) {
                    response += " BENS TSE -";
                    objImpedimentos.impeditivos.bensTSE = "BENS ENCONTRADOS NO AUTOR";
                }

                if (sislabra.imoveisSp) {
                    response += " IMÓVEL SP -";
                    objImpedimentos.impeditivos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO AUTOR";
                }

                if (sislabra.embarcacao) {
                    response += " EMBARCAÇÃO -";
                    objImpedimentos.impeditivos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO AUTOR";
                }

                if (sislabra.aeronave) {
                    response += " AERONAVE -";
                    objImpedimentos.impeditivos.aeronave = "AERONAVE ENCONTRADA NO AUTOR";
                }

                if (sislabra.doacaoEleitoral) {
                    response += " DOAÇÃO ELEITORAL -";
                    objImpedimentos.impeditivos.doacaoEleitoral = "DOAÇÃO ELEITORAL ENCONTRADA NO AUTOR";
                }
            } else {
                const sislabra = await sislabraExtractorLoas(paginaformatada, isPoloAtivo);
                objImpedimentos.nome = sislabra.nome;
                objImpedimentos.identificacao = sislabra.identificacao;

                if (sislabra.veiculos) {
                    response += " VEÍCULOS GF -";
                    objImpedimentos.impeditivos.veiculos = sislabra.veiculos;
                }

                if (sislabra.empregos) {
                    response += " EMPREGO GF -";
                    objImpedimentos.impeditivos.empregos = sislabra.empregos;
                }

                if (sislabra.imoveisRurais) {
                    response += " IMÓVEL RURAL GF -";
                    objImpedimentos.impeditivos.imoveisRurais = sislabra.imoveisRurais;
                }

                if (sislabra.empresas) {
                    response += " EMPRESA GF -";
                    objImpedimentos.impeditivos.empresas = sislabra.empresas;
                }

                if (sislabra.bensTse) {
                    response += " BENS TSE GF -";
                    objImpedimentos.impeditivos.bensTSE = "BENS ENCONTRADOS NO AUTOR";
                }

                if (sislabra.imoveisSp) {
                    response += " IMÓVEL SP GF -";
                    objImpedimentos.impeditivos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO AUTOR";
                }

                if (sislabra.embarcacao) {
                    response += " EMBARCAÇÃO GF -";
                    objImpedimentos.impeditivos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO AUTOR";
                }

                if (sislabra.aeronave) {
                    response += " AERONAVE GF -";
                    objImpedimentos.impeditivos.aeronave = "AERONAVE ENCONTRADA NO AUTOR";
                }

                if (sislabra.doacaoEleitoral) {
                    response += " DOAÇÃO ELEITORAL GF -";
                    objImpedimentos.impeditivos.doacaoEleitoral = "DOAÇÃO ELEITORAL ENCONTRADA NO AUTOR";
                }
            }

            return { impedimentos: response, objImpedimentos: objImpedimentos }
        } catch (e) {
            console.error("Erro ao buscar sislabra LOAS" + e.message)
        }
    }
}