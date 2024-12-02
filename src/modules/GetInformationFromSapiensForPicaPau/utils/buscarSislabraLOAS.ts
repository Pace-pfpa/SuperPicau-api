import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";

export async function buscarSislabraLOAS(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[]
    ): Promise<{ sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO[] | null, sislabraGF: ResponseArvoreDeDocumentoDTO[] | null}> {

    let sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO[] = null;
    let sislabraGF: ResponseArvoreDeDocumentoDTO[] = null;
    
    const labrasPoloAtivo = arrayDeDocumentos.filter((doc) => doc.movimento?.indexOf("PÓLO ATIVO") !== -1);

    if (labrasPoloAtivo.length > 0) {
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

    return { sislabraPoloAtivo, sislabraGF }
}
