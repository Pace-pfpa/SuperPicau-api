import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { CobrancaLabras } from "../types/CobrancaLabras.types";
import { sislabraExtractorCPF } from "./sislabraExtractorCPF";

export async function getImpeditivosLabraCobranca(
    sislabra: JSDOMType
): Promise<{ etiqueta: string, objImpedimentos: CobrancaLabras }> {
    let etiqueta: string = '';

    const objImpedimentos: CobrancaLabras = {
        nome: '',
        impeditivos: {
            veiculos: [],
            imoveisRurais: [],
            empresas: [],
            bensTSE: null,
            imoveisSP: null,
            embarcacao: null,
            aeronave: null,
        }
    }

    const sislabraExtracted = await sislabraExtractorCPF(sislabra)
    objImpedimentos.nome = sislabraExtracted.nome;

    if (sislabraExtracted.veiculos.length > 0) {
        etiqueta += "VEÍCULOS - ";
        objImpedimentos.impeditivos.veiculos = sislabraExtracted.veiculos;
    }

    if (sislabraExtracted.imoveisRurais.length > 0) {
        etiqueta += "IMÓVEL RURAL - ";
        objImpedimentos.impeditivos.imoveisRurais = sislabraExtracted.imoveisRurais;
    }

    if (sislabraExtracted.empresas.length > 0) {
        etiqueta += "EMPRESA - ";
        objImpedimentos.impeditivos.empresas = sislabraExtracted.empresas;
    }

    if (sislabraExtracted.bensTse) {
        etiqueta += "BENS TSE - ";
        objImpedimentos.impeditivos.bensTSE = "BENS ENCONTRADOS NO AUTOR";
    }

    if (sislabraExtracted.imoveisSp) {
        etiqueta += "IMÓVEL SP - ";
        objImpedimentos.impeditivos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO AUTOR";
    }

    if (sislabraExtracted.embarcacao) {
        etiqueta += "EMBARCAÇÃO - ";
        objImpedimentos.impeditivos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO AUTOR";
    }

    if (sislabraExtracted.aeronave) {
        etiqueta += "AERONAVE - ";
        objImpedimentos.impeditivos.aeronave = "AERONAVE ENCONTRADA NO AUTOR";
    }

    return { etiqueta, objImpedimentos }
}