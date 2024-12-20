export function gerarObjetoUpload (impeditivos: string[]) {

    const sislabraAutorPresente = impeditivos.includes("SISLABRA AUTOR NÃO EXISTE");
    const sislabraGFPresente = impeditivos.includes("SISLABRA GF NÃO EXISTE");

    
    // Cria um objeto com os atributos dependentes dos impeditivos encontrados
    const objeto = {
        advogado: impeditivos.includes("ADVOGADO"),
        cadunico: impeditivos.includes("CADÚNICO"),
        litispendencia: impeditivos.includes("LITISPENDÊNCIA"),
        bpc: impeditivos.includes("BPC ATIVO"),
        beneficio: impeditivos.includes("BENEFÍCIO ATIVO"),
        idade: impeditivos.includes("IDADE"),
        requerimento: impeditivos.includes("AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO"),
        renda: impeditivos.includes("RENDA MEDIA") || impeditivos.includes("RENDA ALTA") || impeditivos.includes("RENDA ELEVADA"),
        empresaAutor: sislabraAutorPresente ? null : impeditivos.includes("EMPRESA"),
        bensAutor: sislabraAutorPresente ? null : impeditivos.includes("BENS TSE"),
        veiculoAutor: sislabraAutorPresente ? null : impeditivos.includes("VEÍCULOS"),
        imovelspAutor: sislabraAutorPresente ? null : impeditivos.includes("IMÓVEL SP"),
        imovelruralAutor: sislabraAutorPresente ? null : impeditivos.includes("IMÓVEL RURAL"),
        embarcacaoAutor: sislabraAutorPresente ? null : impeditivos.includes("EMBARCAÇÃO"),
        aeronaveAutor: sislabraAutorPresente ? null : impeditivos.includes("AERONAVE"),
        empresaGF: sislabraGFPresente ? null : impeditivos.includes("EMPRESA GF"),
        bensGF: sislabraGFPresente ? null : impeditivos.includes("BENS TSE GF"),
        veiculoGF: sislabraGFPresente ? null : impeditivos.includes("VEÍCULOS GF"),
        imovelspGF: sislabraGFPresente ? null : impeditivos.includes("IMÓVEL SP GF"),
        imovelruralGF: sislabraGFPresente ? null : impeditivos.includes("IMÓVEL RURAL GF"),
        embarcacaoGF: sislabraGFPresente ? null : impeditivos.includes("EMBARCAÇÃO GF"),
        aeronaveGF: sislabraGFPresente ? null : impeditivos.includes("AERONAVE GF")
    };

    return objeto;
}
