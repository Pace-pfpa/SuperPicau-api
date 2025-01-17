import { renderCampoPatrimonioImcompativel, renderTable, verificarSeTodosSaoVazios } from "..";
import { IImpedimentos } from "../../../GetInformationFromSapiensForPicaPau/dto";


export const renderPatrimonioImcompativel = (autor: IImpedimentos, conjuge: IImpedimentos): string => {
    const valoresParaVerificar = [
      autor?.veiculos,
      conjuge?.veiculos,
      autor?.bensTSE,
      conjuge?.bensTSE,
      autor?.imoveisSP,
      conjuge?.imoveisSP,
      autor?.embarcacao,
      conjuge?.embarcacao,
      autor?.aeronave,
      conjuge?.aeronave,
    ];
    
    if (verificarSeTodosSaoVazios(valoresParaVerificar)) {
      return "";
    }
    
    const bensTseAutor = renderCampoPatrimonioImcompativel("BENS TSE AUTOR", autor?.bensTSE);
    const bensTseConjuge = renderCampoPatrimonioImcompativel("BENS TSE CONJUGE", conjuge?.bensTSE);
    const imoveisSpAutor = renderCampoPatrimonioImcompativel("IMOVEIS SP AUTOR", autor?.imoveisSP);
    const imoveisSpConjuge = renderCampoPatrimonioImcompativel("IMOVEIS SP CONJUGE", conjuge?.imoveisSP);
    const embarcacaoAutor = renderCampoPatrimonioImcompativel("EMBARCAÇÃO AUTOR", autor?.embarcacao);
    const embarcacaoConjuge = renderCampoPatrimonioImcompativel("EMBARCAÇÃO CONJUGE", conjuge?.embarcacao);
    const aeronaveAutor = renderCampoPatrimonioImcompativel("AERONAVE AUTOR", autor?.aeronave);
    const aeronaveConjuge = renderCampoPatrimonioImcompativel("AERONAVE CONJUGE", conjuge?.aeronave);

    if ((autor?.veiculos.length ?? 0) === 0) {
      return `
        <p>
            <strong><span>PATRIMÔNIO INCOMPATÍVEL</span></strong>: 
              A parte autora, seu (sua) cônjuge ou companheiro(a) possui(em) patrimônio incompatível com o regime de economia familiar no curso do período de carência previsto em lei (Lei 8.213/91, art. 11, VII, “a”, “1” e § 1º). <strong>PREQUESTIONAMENTO: </strong> Lei 8.213/91, art. 11, VII, “a”, “1” e § 1º.
        </p>
        ${renderTable(
        conjuge?.veiculos ?? [],
        "Veículos do Cônjuge",
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
      `;
    } else if ((conjuge?.veiculos.length ?? 0) === 0) {
      return `
        <p>
            <strong><span>PATRIMÔNIO INCOMPATÍVEL</span></strong>: 
              A parte autora, seu (sua) cônjuge ou companheiro(a) possui(em) patrimônio incompatível com o regime de economia familiar no curso do período de carência previsto em lei.
        </p>
        ${renderTable(
        autor?.veiculos ?? [],
        "Veículos do Autor",
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
      `;
    }

    return `
        <p>
            <strong><span>PATRIMÔNIO INCOMPATÍVEL</span></strong>: 
              A parte autora, seu (sua) cônjuge ou companheiro(a) possui(em) patrimônio incompatível com o regime de economia familiar no curso do período de carência previsto em lei.
        </p>
        ${renderTable(
        autor?.veiculos ?? [],
        "Veículos do Autor",
        ["marca", "tipo", "valorEstipulado", "placa", "renavam", "anoFabricacao", "municipio", "restricao"]
        )}
        ${renderTable(
        conjuge?.veiculos ?? [],
        "Veículos do Cônjuge",
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
    `;
}