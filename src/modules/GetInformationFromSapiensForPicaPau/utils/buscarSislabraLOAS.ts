import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { IDossieSocialInfo } from "../dto";
import { ISislabraGF } from "../dto/Sislabra/interfaces/ISislabraGF";
import { verificarGeracaoComponentes } from "./verificarGeracaoComponentes";

export async function buscarSislabraLOAS(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[],
    dossieSocialInfo: IDossieSocialInfo,
    cookie: string
    ): Promise<{ sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO[], sislabraGFInfo: ISislabraGF }> {
    
    const familiaAusente = dossieSocialInfo?.grupoFamiliarCpfs.length === 0;

    let sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO[] = [];
    let sislabraGF: ResponseArvoreDeDocumentoDTO[] = [];
    
    const labrasPoloAtivo = arrayDeDocumentos.filter((doc) => doc.movimento?.indexOf("PÓLO ATIVO") !== -1);

    const arraySislabrasValidos: ResponseArvoreDeDocumentoDTO[] = [];
    for (const documento of labrasPoloAtivo) {
        const isErroComponente = await verificarGeracaoComponentes(documento, cookie)
        if (isErroComponente instanceof Error) continue;
        arraySislabrasValidos.push(documento);
    }

    if (arraySislabrasValidos.length > 0) {
        sislabraPoloAtivo = labrasPoloAtivo;
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

    return {
        sislabraPoloAtivo, 
        sislabraGFInfo: { 
            isGrupoFamiliarAusente: familiaAusente, 
            labrasGrupoFamiliar: sislabraGF 
        } 
    };
}
