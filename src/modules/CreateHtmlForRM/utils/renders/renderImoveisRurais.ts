import { renderTable } from "..";
import { IImpedimentos } from "../../../GetInformationFromSapiensForPicaPau/dto";

export const renderImoveisRurais = (autor: IImpedimentos, conjuge: IImpedimentos): string => {
    const autorImoveis = autor?.imoveisRurais ?? [];
    const conjugeImoveis = conjuge?.imoveisRurais ?? [];

    if (autorImoveis.length === 0 && conjugeImoveis.length === 0) {
      return "";
    }

    return `
      <p>
        <strong><span>IMÓVEL RURAL</span></strong>: 
        A parte autora, seu (sua) cônjuge ou companheiro(a) possui(em) 
        <strong>imóvel rural superior a 04 módulos fiscais</strong>, o que inviabiliza a concessão de benefício como segurado especial.
      </p>
      ${autorImoveis.length > 0 ? renderTable(
        autorImoveis,
        "Imóveis Rurais do Autor",
        ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]
        ) : ""}
        ${conjugeImoveis.length > 0 ? renderTable(
        conjugeImoveis,
        "Imóveis Rurais do Cônjuge",
        ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]
      ) : ""}
    `;          
  }