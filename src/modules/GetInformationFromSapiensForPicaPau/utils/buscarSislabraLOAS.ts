import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { IDossieSocialInfo } from "../dto";
import { ISislabraGF } from "../dto/Sislabra/interfaces/ISislabraGF";

export async function buscarSislabraLOAS(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[],
    dossieSocialInfo: IDossieSocialInfo
    ): Promise<{ sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO[], sislabraGFInfo: ISislabraGF }> {
    
    const familiaAusente = dossieSocialInfo?.grupoFamiliarCpfs.length === 0;

    let sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO[] = [];
    let sislabraGF: ResponseArvoreDeDocumentoDTO[] = [];
    
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

    return {
        sislabraPoloAtivo, 
        sislabraGFInfo: { 
            isGrupoFamiliarAusente: familiaAusente, 
            labrasGrupoFamiliar: sislabraGF 
        } 
    };
}
