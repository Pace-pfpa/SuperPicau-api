import { renderTable } from "../..";
import { IImpedimentosMaternidade } from "../../../../GetInformationFromSapiensForPicaPau/dto/Sislabra/interfaces/maternidade/IImpedimentosMaternidade";

export const renderImoveisRuraisMaternidade = (autor: IImpedimentosMaternidade, conjuge: IImpedimentosMaternidade): string => {
    const autorImoveis = autor?.impeditivos.imoveisRurais ?? [];
    const conjugeImoveis = conjuge?.impeditivos.imoveisRurais ?? [];

    if (autorImoveis.length === 0 && conjugeImoveis.length === 0) {
      return "";
    }

    return `
      ${autorImoveis.length > 0 ? renderTable(
        autorImoveis,
        `Imóveis Rurais do Autor - ${autor?.nome}`,
        ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]
        ) : ""}
        ${conjugeImoveis.length > 0 ? renderTable(
        conjugeImoveis,
        `Imóveis Rurais do Cônjuge - ${conjuge?.nome}`,
        ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]
      ) : ""}
    `;          
  }