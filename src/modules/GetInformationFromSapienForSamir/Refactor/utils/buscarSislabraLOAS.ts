export async function buscarSislabraLOAS(arrayDeDocumentos: any[]): Promise<{ sislabraPoloAtivo: any[] | null, sislabraGF: any[] | null}> {
    let sislabraPoloAtivo = null;
    let sislabraGF = null;
    
    const labrasPoloAtivo = arrayDeDocumentos.filter((doc) => doc.movimento?.indexOf("PÓLO ATIVO") !== -1);

    if (labrasPoloAtivo.length > 0) {
        sislabraPoloAtivo = labrasPoloAtivo;
    } else {
        sislabraPoloAtivo = null;
    }

    const labrasGrupoFamiliar = arrayDeDocumentos.filter((doc) => doc.movimento?.includes("SISLABRA - GF") && doc.documentoJuntado?.tipoDocumento?.sigla.includes('SITCADCPF'));
    const labrasEnvolvidos = arrayDeDocumentos.filter((doc) => doc.movimento?.includes("SISLABRA - ENVOLVIDO") && doc.documentoJuntado?.tipoDocumento?.sigla.includes('PESBEN'));
    const labrasTotal = [...labrasGrupoFamiliar, ...labrasEnvolvidos];

    if (labrasTotal.length > 0) {
        sislabraGF = labrasTotal;
    } else {
        sislabraGF = null;
    }

    return { sislabraPoloAtivo, sislabraGF }
}