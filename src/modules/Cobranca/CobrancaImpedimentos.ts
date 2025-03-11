import { minutaCobranca } from ".";
import { JSDOMType } from "../../shared/dtos/JSDOM";
import { getXPathText } from "../../shared/utils/GetTextoPorXPATH";
import { ICobrancaExtracted } from "./interfaces/ICobrancaExtracted";
import { CobrancaLabras } from "./types/CobrancaLabras.types";
import { InfoCapa } from "./types/InfoCapa.type";
import { atualizarEtiquetaCobranca } from "./utils/atualizarEtiquetaCobranca";
import { converterStringToNumber } from "./utils/converterStringToNumber";
import { identificarDivInteressados } from "./utils/identificarDivInteressados";
import { identificarPolos } from "./utils/identificarPolos";
import { sislabraExtractorCPF } from "./utils/sislabraExtractorCPF";

export class CobrancaImpedimentos {
    private infoCapa(
        capa: JSDOMType
    ): InfoCapa {
        let valorCausa: string = null;
        let valorCausaNumerico: number = null;
        let etiqueta: string | null = null;

        const divInteressados = identificarDivInteressados(capa);
        if (!divInteressados) throw new Error('Erro ao identificar div para buscar informações')

        const polos = identificarPolos(capa, divInteressados);

        const valorCausaTitulo = getXPathText(capa, `/html/body/div/div[${divInteressados - 2}]/table/tbody/tr[6]/td[1]`)
        if (valorCausaTitulo.includes('Valor da Causa')) {
            valorCausa = getXPathText(capa, `/html/body/div/div[${divInteressados - 2}]/table/tbody/tr[6]/td[2]`)
            valorCausaNumerico = converterStringToNumber(valorCausa)

            if (valorCausaNumerico !== null) {
                if (valorCausaNumerico <= 10000) {
                    etiqueta = "EXECUÇÃO 10 MIL";
                } else if (valorCausaNumerico <= 100000) {
                    etiqueta = "EXECUÇÃO 100 MIL";
                } else if (valorCausaNumerico <= 200000) {
                    etiqueta = "EXECUÇÃO 200 MIL";
                } else {
                    etiqueta = "EXECUÇÃO ALTA";
                }
            }
        }

        return {
            valorCausa,
            valorCausaNumerico,
            poloAtivo: polos.poloAtivo,
            poloPassivo: polos.poloPassivo,
            etiqueta
        }
    }

    private async infoSislabra(
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
            etiqueta += " VEÍCULOS -";
            objImpedimentos.impeditivos.veiculos = sislabraExtracted.veiculos;
        }

        if (sislabraExtracted.imoveisRurais.length > 0) {
            etiqueta += " IMÓVEL RURAL -";
            objImpedimentos.impeditivos.imoveisRurais = sislabraExtracted.imoveisRurais;
        }

        if (sislabraExtracted.empresas.length > 0) {
            etiqueta += " EMPRESA -";
            objImpedimentos.impeditivos.empresas = sislabraExtracted.empresas;
        }

        if (sislabraExtracted.bensTse) {
            etiqueta += " BENS TSE -";
            objImpedimentos.impeditivos.bensTSE = "BENS ENCONTRADOS NO AUTOR";
        }

        if (sislabraExtracted.imoveisSp) {
            etiqueta += " IMÓVEL SP -";
            objImpedimentos.impeditivos.imoveisSP = "IMÓVEIS EM SP ENCONTRADOS NO AUTOR";
        }

        if (sislabraExtracted.embarcacao) {
            etiqueta += " EMBARCAÇÃO -";
            objImpedimentos.impeditivos.embarcacao = "EMBARCAÇÃO ENCONTRADA NO AUTOR";
        }

        if (sislabraExtracted.aeronave) {
            etiqueta += " AERONAVE -";
            objImpedimentos.impeditivos.aeronave = "AERONAVE ENCONTRADA NO AUTOR";
        }

        return { etiqueta, objImpedimentos }
    }

    async execute(
        data: ICobrancaExtracted
    ): Promise<{
        success: boolean;
        hasBens?: boolean;
        error?: string;
    }> {
        try {
            const capaInformation = this.infoCapa(data.capa);
            const labraInformation = await this.infoSislabra(data.sislabra);

            console.log(capaInformation)
            console.log(labraInformation.objImpedimentos.impeditivos)
    
            if (!labraInformation.etiqueta) {
                if (data.infoUpload.subirMinuta) {
                    try {
                        await minutaCobranca.cobrancaSemBens(data.cookie, data.infoUpload);
                        await new Promise(resolve => setTimeout(resolve, 5000));    
                    } catch (error) {
                        console.error("Erro ao subir minuta cobrança (sem bens): ", error.message);
                    }
                }

                await atualizarEtiquetaCobranca(data.cookie, `COB. SEM BENS`, data.tarefaId)
                return { success: true, hasBens: false }
            } else {
                if (data.infoUpload.subirMinuta) {
                    try {
                        const arrayImpedimentos: string[] = labraInformation.etiqueta.split(" - ")
                        await minutaCobranca.cobrancaComBens(
                            data,
                            arrayImpedimentos,
                            capaInformation,
                            labraInformation.objImpedimentos
                        );
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    } catch (error) {
                        console.error("Erro ao subir a minuta cobrança (com bens): ", error.message);
                    }
                }

                await atualizarEtiquetaCobranca(data.cookie, `COB. COM BENS: ${capaInformation.etiqueta} - ${labraInformation.etiqueta}`, data.tarefaId)
                return { success: true, hasBens: true }
            }
        } catch (error) {
            console.error('Erro nos impeditivos do Cobrança: ', error.message);
            throw error
        }
    }
}
