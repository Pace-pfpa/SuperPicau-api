import { renderCampoPatrimonioImcompativel, renderTable, verificarSeTodosSaoVazios } from "../../CreateHtmlForRM/utils";
import { CobrancaLabras } from "../types/CobrancaLabras.types";
import { HtmlImpeditivosCobrancaType } from "../types/HtmlImpeditivosCobranca.type";

export const renderPatrimonioCobranca = (
    valoresBooleanos: HtmlImpeditivosCobrancaType,
    impeditivos: CobrancaLabras, 
): string => {
    const valoresParaVerificar = [
      valoresBooleanos.bensTSE,
      valoresBooleanos.veiculos,
      valoresBooleanos.imoveisSP,
      valoresBooleanos.imovelRural,
      valoresBooleanos.embarcacao,
      valoresBooleanos.aeronave
    ];
    
    if (verificarSeTodosSaoVazios(valoresParaVerificar)) {
      return "";
    }
    
    const bensTse = valoresBooleanos.bensTSE
        ? renderCampoPatrimonioImcompativel(`BENS TSE`, impeditivos.impeditivos.bensTSE)
        : '';
    
    const veiculos = valoresBooleanos.veiculos
    ? renderTable(
        impeditivos.impeditivos.veiculos,
        "VEÍCULOS",
        ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"])
    : ''

    const imoveisSp = valoresBooleanos.imoveisSP
    ? renderCampoPatrimonioImcompativel(`IMÓVEIS EM SP`, impeditivos.impeditivos.imoveisSP)
    : '';

    const imovelRural = valoresBooleanos.imovelRural
    ? renderTable(
        impeditivos.impeditivos.imoveisRurais,
        'IMÓVEIS RURAIS',
        ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]) 
    : ""

    const embarcacao = valoresBooleanos.embarcacao
    ? renderCampoPatrimonioImcompativel(`EMBARCAÇÃO`, impeditivos.impeditivos.embarcacao)
    : '';

    const aeronave = valoresBooleanos.aeronave
    ? renderCampoPatrimonioImcompativel(`AERONAVE`, impeditivos.impeditivos.aeronave)
    : '';


    return `
        <p>
            <strong><span>PENHORA DOS BENS</span></strong>
        </p>
        ${bensTse}
        ${veiculos}
        ${imoveisSp}
        ${imovelRural}
        ${embarcacao}
        ${aeronave}
    `;
}