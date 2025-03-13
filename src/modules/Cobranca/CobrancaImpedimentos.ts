import { minutaCobranca } from ".";
import { JSDOMType } from "../../shared/dtos/JSDOM";
import { getXPathText } from "../../shared/utils/GetTextoPorXPATH";
import { atualizarEtiquetaAviso } from "../GetInformationFromSapiensForPicaPau/utils";
import { ICobrancaExtracted } from "./interfaces/ICobrancaExtracted";
import { CobrancaLabras } from "./types/CobrancaLabras.types";
import { InfoCapa } from "./types/InfoCapa.type";
import { atualizarEtiquetaCobranca } from "./utils/atualizarEtiquetaCobranca";
import { converterStringToNumber } from "./utils/converterStringToNumber";
import { getImpeditivosLabraCobranca } from "./utils/getImpeditivosLabraCobranca";
import { identificarDivInteressados } from "./utils/identificarDivInteressados";
import { identificarPolos } from "./utils/identificarPolos";

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
        sislabras: JSDOMType[]
    ): Promise<{ etiqueta: string, objImpedimentos: CobrancaLabras[] }> {
        let etiqueta: string = '';
        let impedimentosCobrados: CobrancaLabras[] = []
        
        if (sislabras.length > 0) {
            for (let labra of sislabras) {
                const sislabraPolo = await getImpeditivosLabraCobranca(labra);
                if (!etiqueta.includes(sislabraPolo.etiqueta)) {
                    etiqueta += sislabraPolo.etiqueta;
                    impedimentosCobrados.push(sislabraPolo.objImpedimentos)
                }
            }
        }

        return { etiqueta, objImpedimentos: impedimentosCobrados }
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
            console.log(labraInformation.objImpedimentos)
    
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
                const arrayImpedimentos: string[] = [...new Set(
                    labraInformation.etiqueta
                      .split(" - ")
                      .map(item => item.trim())
                      .filter(item => item)
                  )];

                if (data.infoUpload.subirMinuta) {
                    try {
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

                const impedimentosLimpos = arrayImpedimentos.join(" - ");

                await atualizarEtiquetaCobranca(data.cookie, `COB. COM BENS: ${capaInformation.etiqueta} - ${impedimentosLimpos}`, data.tarefaId)
                return { success: true, hasBens: true }
            }
        } catch (error) {
            console.error('Erro nos impeditivos do Cobrança: ', error.message);
            await atualizarEtiquetaAviso(data.cookie, `${error.message}`, data.tarefaId)
            return { success: false, error: error.message }
        }
    }
}
