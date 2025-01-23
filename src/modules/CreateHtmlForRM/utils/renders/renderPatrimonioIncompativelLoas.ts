import { renderCampoPatrimonioImcompativel, renderTable, verificarSeTodosSaoVazios } from "..";
import { IImpedimentosLoas } from "../../../GetInformationFromSapiensForPicaPau/dto/Sislabra/interfaces/IImpedimentosLoas";

export const renderPatrimonioImcompativelLoas = (
    autor: IImpedimentosLoas,
    grupoFamiliar: IImpedimentosLoas[]
): string => {
    const valoresParaVerificar = [
        autor?.veiculos,
        ...grupoFamiliar.map((membro) => membro.veiculos),
        autor?.bensTSE,
        ...grupoFamiliar.map((membro) => membro.bensTSE),
        autor?.imoveisSP,
        ...grupoFamiliar.map((membro) => membro.imoveisSP),
        autor?.embarcacao,
        ...grupoFamiliar.map((membro) => membro.embarcacao),
        autor?.aeronave,
        ...grupoFamiliar.map((membro) => membro.aeronave),
    ];

    if (verificarSeTodosSaoVazios(valoresParaVerificar)) {
        return "";
    }

    // AUTOR
    const bensTseAutor = renderCampoPatrimonioImcompativel("BENS TSE AUTOR", autor?.bensTSE);
    const imoveisSpAutor = renderCampoPatrimonioImcompativel("IMOVEIS SP AUTOR", autor?.imoveisSP);
    const embarcacaoAutor = renderCampoPatrimonioImcompativel("EMBARCAÇÃO AUTOR", autor?.embarcacao);
    const aeronaveAutor = renderCampoPatrimonioImcompativel("AERONAVE AUTOR", autor?.aeronave);
    const doacaoEleitoralAutor = renderCampoPatrimonioImcompativel("DOAÇÃO ELEITORAL", autor?.doacaoEleitoral);
    const veiculosAutor = autor?.veiculos.length
        ? renderTable(
            autor.veiculos,
            "Veículos do Autor",
            ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
        ) : '';
    const imoveisRuraisAutor = autor?.imoveisRurais.length
        ? renderTable(
            autor.imoveisRurais,
            "Imóveis Rurais do Autor",
            ["nomeImovel", "sncr", "numeroCafir", "dataInscricao", "localizacao", "distrito", "cep", "municipio", "uf"]
        ) : '';

    // GRUPO FAMILIAR
    const bensTseGF = grupoFamiliar
    .map((membro, index) =>
      renderCampoPatrimonioImcompativel(
        `BENS TSE GF - Membro ${index + 1}`,
        membro.bensTSE
      )
    )
    .join("");
    const imoveisSpGF = grupoFamiliar
        .map((membro, index) =>
        renderCampoPatrimonioImcompativel(
            `IMOVEIS SP GF - Membro ${index + 1}`,
            membro.imoveisSP
        )
        )
        .join("");
    const embarcacaoGF = grupoFamiliar
        .map((membro, index) =>
        renderCampoPatrimonioImcompativel(
            `EMBARCAÇÃO GF - Membro ${index + 1}`,
            membro.embarcacao
        )
        )
        .join("");
    const aeronaveGF = grupoFamiliar
        .map((membro, index) =>
        renderCampoPatrimonioImcompativel(
            `AERONAVE GF - Membro ${index + 1}`,
            membro.aeronave
        )
        )
        .join("");
    const veiculosGF = grupoFamiliar
        .map((membro, index) =>
          membro.veiculos.length
            ? renderTable(
                membro.veiculos,
                `Veículos do GF - Membro ${index + 1}`,
                ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
              ) : ''
        )
        .join("");
    const imoveisRuraisGF = grupoFamiliar
        .map((membro, index) =>
            membro.imoveisRurais.length
            ? renderTable(
                membro.imoveisRurais,
                `Imóveis Rurais do GF - Membro ${index + 1}`,
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