
import { renderCampoPatrimonioImcompativel, renderTable, verificarSeTodosSaoVazios } from "../..";
import { IImpedimentosMaternidade } from "../../../../GetInformationFromSapiensForPicaPau/dto/Sislabra/interfaces/maternidade/IImpedimentosMaternidade";
import { renderImoveisRuraisMaternidade } from "./renderImoveisRuraisMaternidade";



export const renderPatrimonioImcompativelMaternidade = (autor: IImpedimentosMaternidade, conjuge: IImpedimentosMaternidade): string => {
    const valoresParaVerificar = [
      autor?.impeditivos.veiculos,
      conjuge?.impeditivos.veiculos,
      autor?.impeditivos.bensTSE,
      conjuge?.impeditivos.bensTSE,
      autor?.impeditivos.imoveisSP,
      conjuge?.impeditivos.imoveisSP,
      autor?.impeditivos.embarcacao,
      conjuge?.impeditivos.embarcacao,
      autor?.impeditivos.aeronave,
      conjuge?.impeditivos.aeronave,
      autor?.impeditivos.imoveisRurais,
      conjuge?.impeditivos.imoveisRurais
    ];
    
    if (verificarSeTodosSaoVazios(valoresParaVerificar)) {
      return "";
    }
    
    const bensTseAutor = renderCampoPatrimonioImcompativel(`BENS TSE AUTOR - ${autor?.nome}`, autor?.impeditivos.bensTSE);
    const bensTseConjuge = renderCampoPatrimonioImcompativel(`BENS TSE CONJUGE - ${conjuge?.nome}`, conjuge?.impeditivos.bensTSE);
    const imoveisSpAutor = renderCampoPatrimonioImcompativel(`IMOVEIS SP AUTOR - ${autor?.nome}`, autor?.impeditivos.imoveisSP);
    const imoveisSpConjuge = renderCampoPatrimonioImcompativel(`IMOVEIS SP CONJUGE - ${conjuge?.nome}`, conjuge?.impeditivos.imoveisSP);
    const embarcacaoAutor = renderCampoPatrimonioImcompativel(`EMBARCAÇÃO AUTOR - ${autor?.nome}`, autor?.impeditivos.embarcacao);
    const embarcacaoConjuge = renderCampoPatrimonioImcompativel(`EMBARCAÇÃO CONJUGE - ${conjuge?.nome}`, conjuge?.impeditivos.embarcacao);
    const aeronaveAutor = renderCampoPatrimonioImcompativel(`AERONAVE AUTOR - ${autor?.nome}`, autor?.impeditivos.aeronave);
    const aeronaveConjuge = renderCampoPatrimonioImcompativel(`AERONAVE CONJUGE - ${conjuge?.nome}`, conjuge?.impeditivos.aeronave);

    const imovelRural = renderImoveisRuraisMaternidade(autor, conjuge);

    if ((autor?.impeditivos.veiculos.length ?? 0) === 0) {
      return `
        <p>
            <strong><span>PATRIMÔNIO INCOMPATÍVEL</span></strong>: 
              A parte autora, seu (sua) cônjuge ou companheiro(a) possui(em) patrimônio incompatível com o regime de economia familiar no curso do período de carência previsto em lei. <strong>PREQUESTIONAMENTO: </strong> Lei 8.213/91, art. 11, VII, “a”, “1” e § 1º.
        </p>
        ${conjuge && conjuge.impeditivos.veiculos.length > 0 ?
          renderTable(
            conjuge.impeditivos.veiculos,
            `Veículos do Cônjuge - ${conjuge.nome ?? ''}`,
          ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
          ) : ''
        }
        ${bensTseAutor}
        ${bensTseConjuge}
        ${imoveisSpAutor}
        ${imoveisSpConjuge}
        ${embarcacaoAutor}
        ${embarcacaoConjuge}
        ${aeronaveAutor}
        ${aeronaveConjuge}
        ${imovelRural}
      `;
    } else if ((conjuge?.impeditivos.veiculos.length ?? 0) === 0) {
      return `
        <p>
            <strong><span>PATRIMÔNIO INCOMPATÍVEL</span></strong>: 
              A parte autora, seu (sua) cônjuge ou companheiro(a) possui(em) patrimônio incompatível com o regime de economia familiar no curso do período de carência previsto em lei. <strong>PREQUESTIONAMENTO: </strong> Lei 8.213/91, art. 11, VII, “a”, “1” e § 1º.
        </p>
        ${autor && autor.impeditivos.veiculos.length > 0 ?
          renderTable(
            autor.impeditivos.veiculos,
            `Veículos do Autor - ${autor.nome ?? ''}`,
            ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
          ) : ''
        }
        ${bensTseAutor}
        ${bensTseConjuge}
        ${imoveisSpAutor}
        ${imoveisSpConjuge}
        ${embarcacaoAutor}
        ${embarcacaoConjuge}
        ${aeronaveAutor}
        ${aeronaveConjuge}
        ${imovelRural}
      `;
    }

    return `
        <p>
            <strong><span>PATRIMÔNIO INCOMPATÍVEL</span></strong>: 
              A parte autora, seu (sua) cônjuge ou companheiro(a) possui(em) patrimônio incompatível com o regime de economia familiar no curso do período de carência previsto em lei. <strong>PREQUESTIONAMENTO: </strong> Lei 8.213/91, art. 11, VII, “a”, “1” e § 1º.
        </p>
        ${renderTable(
        autor?.impeditivos.veiculos ?? [],
        `Veículos do Autor - ${autor?.nome}`,
        ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
        )}
        ${renderTable(
        conjuge?.impeditivos.veiculos ?? [],
        `Veículos do Cônjuge - ${conjuge?.nome}`,
        ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
        )}
        ${bensTseAutor}
        ${bensTseConjuge}
        ${imoveisSpAutor}
        ${imoveisSpConjuge}
        ${embarcacaoAutor}
        ${embarcacaoConjuge}
        ${aeronaveAutor}
        ${aeronaveConjuge}
        ${imovelRural}
    `;
}