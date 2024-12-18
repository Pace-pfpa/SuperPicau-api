import { HtmlIImpeditivosRuralMaternidadeDTO } from "../../CreateHtmlForRuralMaternidade/dtos/HtmlImpeditivosRMDTO";

export function gerarObjetoUploadRM (impeditivos: string[]): HtmlIImpeditivosRuralMaternidadeDTO {

    const sislabraAutorPresente = impeditivos.some(imp => imp.trim() === "SISLABRA AUTOR NÃO EXISTE");
    const sislabraConjugePresente = impeditivos.some(imp => imp.trim() === "SISLABRA GF NÃO EXISTE");

    
    // Cria um objeto com os atributos dependentes dos impeditivos encontrados
    const objeto: HtmlIImpeditivosRuralMaternidadeDTO = {
        advogado: impeditivos.some(imp => imp.trim() === "ADVOGADO"),
        requerimento: impeditivos.some(imp => imp.trim() === "AUSÊNCIA DE REQUERIMENTO AUTOR"),
        emprego: impeditivos.some(imp => imp.trim() === "EMPREGO"),
        vinculoAberto: impeditivos.some(imp => imp.trim() === "VÍNCULO ABERTO"),
        concessaoAnterior: impeditivos.some(imp => imp.trim() === "CONCESSÃO ANTERIOR"),
        litispendencia: impeditivos.some(imp => imp.trim() === "POSSÍVEL LITISPENDÊNCIA/COISA JULGADA r" || imp.trim() === "POSSÍVEL LITISPENDÊNCIA/COISA JULGADA m"),
        idade: impeditivos.some(imp => imp.trim() === "IDADE"),
        veiculoAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "VEICULO AUTOR"),
        empregoAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "EMPREGO AUTOR"),
        imovelruralAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "IMOVEIS RURAIS AUTOR"),
        empresaAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "EMPRESA AUTOR"),
        bensTSEAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "BENS TSE AUTOR"),
        imoveisSPAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "IMÓVEL SP AUTOR"),
        embarcacaoAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "EMBARCAÇÃO AUTOR"),
        aeronaveAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "AERONAVE AUTOR"),
        veiculoConjuge: sislabraConjugePresente ? null : impeditivos.some(imp => imp.trim() === "VEICULO CONJUGE"),
        empregoConjuge: sislabraConjugePresente ? null : impeditivos.some(imp => imp.trim() === "EMPREGO CONJUGE"),
        imovelruralConjuge: sislabraConjugePresente ? null : impeditivos.some(imp => imp.trim() === "IMOVEIS RURAIS CONJUGE"),
        empresaConjuge: sislabraConjugePresente ? null : impeditivos.some(imp => imp.trim() === "EMPRESA CONJUGE"),
        bensTSEConjuge: sislabraConjugePresente ? null : impeditivos.some(imp => imp.trim() === "BENS TSE CONJUGE"),
        imoveisSPConjuge: sislabraConjugePresente ? null : impeditivos.some(imp => imp.trim() === "IMÓVEL SP CONJUGE"),
        embarcacaoConjuge: sislabraConjugePresente ? null : impeditivos.some(imp => imp.trim() === "EMBARCAÇÃO CONJUGE"),
        aeronaveConjuge: sislabraConjugePresente ? null : impeditivos.some(imp => imp.trim() === "AERONAVE CONJUGE")
    };

    return objeto;
}
