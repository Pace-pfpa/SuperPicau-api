import { HtmlIImpeditivosLoasDTO } from "../dto/HtmlImpeditivosLoasDTO";

export function gerarObjetoUploadLoas(impeditivos: string[]): HtmlIImpeditivosLoasDTO {

    const sislabraAutorPresente = impeditivos.some(imp => imp.trim() === "SISLABRA AUTOR NÃO EXISTE");
    const sislabraGFPresente = impeditivos.some(imp => imp.trim() === "SISLABRA GF NÃO EXISTE");
    
    // Cria um objeto com os atributos dependentes dos impeditivos encontrados
    const objeto: HtmlIImpeditivosLoasDTO = {
        advogado: impeditivos.some(imp => imp.trim() === "ADVOGADO"),
        cadunico: impeditivos.some(imp => imp.trim() === "CADÚNICO"),
        litispendencia: impeditivos.some(imp => imp.trim() === "LITISPENDÊNCIA"),
        bpc: impeditivos.some(imp => imp.trim() === "BPC ATIVO"),
        beneficio: impeditivos.some(imp => imp.trim() === "BENEFÍCIO ATIVO"),
        idade: impeditivos.some(imp => imp.trim() === "IDADE"),
        requerimento: impeditivos.some(imp => imp.trim() === "AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO"),
        renda: impeditivos.some(imp => imp.trim() === "RENDA MEDIA") || impeditivos.some(imp => imp.trim() === "RENDA ALTA") || impeditivos.some(imp => imp.trim() === "RENDA ELEVADA"),
        empresaAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "EMPRESA"),
        bensAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "BENS TSE"),
        veiculoAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "VEÍCULOS"),
        imovelspAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "IMÓVEL SP"),
        imovelruralAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "IMÓVEL RURAL"),
        embarcacaoAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "EMBARCAÇÃO"),
        aeronaveAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "AERONAVE"),
        doacaoEleitoralAutor: sislabraAutorPresente ? null : impeditivos.some(imp => imp.trim() === "DOAÇÃO ELEITORAL"),
        empresaGF: sislabraGFPresente ? null : impeditivos.some(imp => imp.trim() === "EMPRESA GF"),
        bensGF: sislabraGFPresente ? null : impeditivos.some(imp => imp.trim() === "BENS TSE GF"),
        veiculoGF: sislabraGFPresente ? null : impeditivos.some(imp => imp.trim() === "VEÍCULOS GF"),
        imovelspGF: sislabraGFPresente ? null : impeditivos.some(imp => imp.trim() === "IMÓVEL SP GF"),
        imovelruralGF: sislabraGFPresente ? null : impeditivos.includes("IMÓVEL RURAL GF"),
        embarcacaoGF: sislabraGFPresente ? null : impeditivos.some(imp => imp.trim() === "EMBARCAÇÃO GF"),
        aeronaveGF: sislabraGFPresente ? null : impeditivos.some(imp => imp.trim() === "AERONAVE GF"),
        doacaoEleitoralGF: sislabraGFPresente ? null : impeditivos.some(imp => imp.trim() === "DOAÇÃO ELEITORAL GF")
    };

    return objeto;
}
