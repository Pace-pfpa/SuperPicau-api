import { renderCampoPatrimonioImcompativel, renderTable, verificarSeTodosSaoVazios } from "..";
import { IImpedimentosLoas } from "../../../GetInformationFromSapiensForPicaPau/dto/Sislabra/interfaces/IImpedimentosLoas";

export const renderPatrimonioImcompativelLoas = (
    autor: IImpedimentosLoas,
    grupoFamiliar: IImpedimentosLoas[]
): string => {
    const valoresParaVerificar = [
        autor?.impeditivos.veiculos,
        ...grupoFamiliar.map((membro) => membro.impeditivos.veiculos),
        autor?.impeditivos.bensTSE,
        ...grupoFamiliar.map((membro) => membro.impeditivos.bensTSE),
        autor?.impeditivos.imoveisSP,
        ...grupoFamiliar.map((membro) => membro.impeditivos.imoveisSP),
        autor?.impeditivos.embarcacao,
        ...grupoFamiliar.map((membro) => membro.impeditivos.embarcacao),
        autor?.impeditivos.aeronave,
        ...grupoFamiliar.map((membro) => membro.impeditivos.aeronave),
    ];

    if (verificarSeTodosSaoVazios(valoresParaVerificar)) {
        return "";
    }

    // AUTOR
    const bensTseAutor = renderCampoPatrimonioImcompativel("BENS TSE AUTOR", autor?.impeditivos.bensTSE);
    const imoveisSpAutor = renderCampoPatrimonioImcompativel("IMOVEIS SP AUTOR", autor?.impeditivos.imoveisSP);
    const embarcacaoAutor = renderCampoPatrimonioImcompativel("EMBARCAÇÃO AUTOR", autor?.impeditivos.embarcacao);
    const aeronaveAutor = renderCampoPatrimonioImcompativel("AERONAVE AUTOR", autor?.impeditivos.aeronave);
    const doacaoEleitoralAutor = renderCampoPatrimonioImcompativel("DOAÇÃO ELEITORAL", autor?.impeditivos.doacaoEleitoral);
    const veiculosAutor = autor?.impeditivos.veiculos.length
        ? renderTable(
            autor.impeditivos.veiculos,
            "Veículos do Autor",
            ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
        ) : '';
    const imoveisRuraisAutor = autor?.impeditivos.imoveisRurais.length
        ? renderTable(
            autor.impeditivos.imoveisRurais,
            "Imóveis Rurais do Autor",
            ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]
        ) : '';

    // GRUPO FAMILIAR
    const bensTseGF = grupoFamiliar
    .map((membro) =>
      renderCampoPatrimonioImcompativel(
        `BENS TSE GF - ${membro.nome}`,
        membro.impeditivos.bensTSE
      )
    )
    .join("");
    const imoveisSpGF = grupoFamiliar
        .map((membro) =>
        renderCampoPatrimonioImcompativel(
            `IMOVEIS SP GF - ${membro.nome}`,
            membro.impeditivos.imoveisSP
        )
        )
        .join("");
    const embarcacaoGF = grupoFamiliar
        .map((membro) =>
        renderCampoPatrimonioImcompativel(
            `EMBARCAÇÃO GF - ${membro.nome}`,
            membro.impeditivos.embarcacao
        )
        )
        .join("");
    const aeronaveGF = grupoFamiliar
        .map((membro) =>
        renderCampoPatrimonioImcompativel(
            `AERONAVE GF - ${membro.nome}`,
            membro.impeditivos.aeronave
        )
        )
        .join("");
    const veiculosGF = grupoFamiliar
        .map((membro) =>
          membro.impeditivos.veiculos.length
            ? renderTable(
                membro.impeditivos.veiculos,
                `Veículos do GF - ${membro.nome}`,
                ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
              ) : ''
        )
        .join("");
    const imoveisRuraisGF = grupoFamiliar
        .map((membro) =>
            membro.impeditivos.imoveisRurais.length
            ? renderTable(
                membro.impeditivos.imoveisRurais,
                `Imóveis Rurais do GF - ${membro.nome}`,
                ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]
            ) : '',
        )

    return `
        <p>
            <strong><span>PATRIMÔNIO INCOMPATÍVEL</span></strong>: 
            A parte autora ou algum integrante do grupo familiar possui(em) patrimônio incompatível com o regime de economia familiar no curso do período de carência previsto em lei.
        </p>
        ${veiculosAutor}
        ${veiculosGF}
        ${bensTseAutor}
        ${bensTseGF}
        ${embarcacaoAutor}
        ${embarcacaoGF}
        ${aeronaveAutor}
        ${aeronaveGF}
        ${imoveisRuraisAutor}
        ${imoveisRuraisGF}
        ${imoveisSpAutor}
        ${imoveisSpGF}
        ${doacaoEleitoralAutor}
    `;
}