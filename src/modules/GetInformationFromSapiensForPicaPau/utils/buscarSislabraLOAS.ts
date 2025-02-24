const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { IDossieSocialInfo } from "../dto";
import { ISislabraGF } from "../dto/Sislabra/interfaces/ISislabraGF";
import { verificarGeracaoComponentes } from "./verificarGeracaoComponentes";

export async function buscarSislabraLOAS(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[],
    dossieSocialInfo: IDossieSocialInfo,
    cookie: string
    ): Promise<{ sislabraPoloAtivo: JSDOMType[], sislabraGFInfo: ISislabraGF }> {
    
    const familiaAusente = dossieSocialInfo?.grupoFamiliarCpfs.length === 0;

    let sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO[] = [];
    let sislabraGF: ResponseArvoreDeDocumentoDTO[] = [];

    let sislabraAutorFormatado: JSDOMType[] = [];
    let sislabraGFFormatado: JSDOMType[] = [];
    
    const labrasPoloAtivo = arrayDeDocumentos.filter((doc) => doc.movimento?.indexOf("PÓLO ATIVO") !== -1);

    const arraySislabrasValidos: ResponseArvoreDeDocumentoDTO[] = [];
    for (const documento of labrasPoloAtivo) {
        const isErroComponente = await verificarGeracaoComponentes(documento, cookie)
        if (isErroComponente instanceof Error) continue;
        arraySislabrasValidos.push(documento);
    }

    if (arraySislabrasValidos.length > 0) {
        sislabraPoloAtivo = arraySislabrasValidos;
    }

    for (const documento of sislabraPoloAtivo) {
        try {
            const idSislabraAutor = documento.documentoJuntado.componentesDigitais[0].id;
            const paginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraAutor });
            const paginaFormatadaAutor = new JSDOM(paginaSislabraAutor);
            
            sislabraAutorFormatado.push(paginaFormatadaAutor);
        } catch (error) {
            console.error(error.message);
            continue
        }
    }

    const labrasGrupoFamiliar = arrayDeDocumentos.filter((doc) => 
        doc.movimento?.includes("SISLABRA - GF") && doc.documentoJuntado?.tipoDocumento?.sigla.includes('SITCADCPF')
    );
    const labrasEnvolvidos = arrayDeDocumentos.filter((doc) => 
        doc.movimento?.includes("SISLABRA - ENVOLVIDO") && doc.documentoJuntado?.tipoDocumento?.sigla.includes('PESBEN')
    );
    
    const labrasTotal = [...labrasGrupoFamiliar, ...labrasEnvolvidos];

    if (labrasTotal.length > 0) {
        sislabraGF = labrasTotal;
    }

    for (const documento of sislabraGF) {
        try {
            const idSislabraConjuge = documento.documentoJuntado.componentesDigitais[0].id;
            const paginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraConjuge });
            const paginaFormatadaConjuge = new JSDOM(paginaSislabraConjuge);
    
            sislabraGFFormatado.push(paginaFormatadaConjuge);
        } catch (error) {
            console.error(error.message);
            continue;
        }
    }

    return {
        sislabraPoloAtivo: sislabraAutorFormatado, 
        sislabraGFInfo: { 
            isGrupoFamiliarAusente: familiaAusente, 
            labrasGrupoFamiliar: sislabraGFFormatado 
        } 
    };
}
