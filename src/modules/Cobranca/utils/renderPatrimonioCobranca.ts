import { renderCampoPatrimonioImcompativel, renderTable, verificarSeTodosSaoVazios } from "../../CreateHtmlForRM/utils";
import { CobrancaLabras } from "../types/CobrancaLabras.types";
import { HtmlImpeditivosCobrancaType } from "../types/HtmlImpeditivosCobranca.type";

export const renderPatrimonioCobranca = (
    valoresBooleanos: HtmlImpeditivosCobrancaType,
    impeditivos: CobrancaLabras[], 
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
    ? impeditivos.map((membro) =>
      renderCampoPatrimonioImcompativel(
        `Bens TSE - ${membro.nome}`,
        membro.impeditivos.bensTSE
      )).join("")
    : '';

    const veiculos = valoresBooleanos.veiculos
    ? impeditivos.map((membro) =>
          membro.impeditivos.veiculos.length
            ? renderTable(
                membro.impeditivos.veiculos,
                `Veículos - ${membro.nome}`,
                ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
              ) : ''
        )
        .join("")
    : '';

    const imoveisSp = valoresBooleanos.imoveisSP
    ? impeditivos.map((membro) =>
        renderCampoPatrimonioImcompativel(
            `Imóveis SP - ${membro.nome}`,
            membro.impeditivos.imoveisSP
        )).join("")
    : '';

    const imovelRural = valoresBooleanos.imovelRural
    ? impeditivos.map((membro) =>
            membro.impeditivos.imoveisRurais.length
            ? renderTable(
                membro.impeditivos.imoveisRurais,
                `Imóveis rurais - ${membro.nome}`,
                ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]
            ) : '',
        )
    : '';

    const embarcacao = valoresBooleanos.embarcacao
    ? impeditivos
        .map((membro) =>
        renderCampoPatrimonioImcompativel(
            `Embarcação - ${membro.nome}`,
            membro.impeditivos.embarcacao
        )).join("")
    : '';

    const aeronave = valoresBooleanos.aeronave
    ? impeditivos
        .map((membro) =>
        renderCampoPatrimonioImcompativel(
            `Aeronave - ${membro.nome}`,
            membro.impeditivos.aeronave
        )).join("")
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