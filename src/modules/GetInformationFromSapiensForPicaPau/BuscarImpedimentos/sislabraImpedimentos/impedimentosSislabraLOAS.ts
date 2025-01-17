import { JSDOM } from 'jsdom';
import { getDocumentoUseCase } from "../../../GetDocumento";
import { getDocumentSislabraFromSapiensLoas } from "../../GetDocumentSislabraFromSapiens";
import { ResponseArvoreDeDocumentoDTO } from '../../../GetArvoreDocumento';
import { IResponseSislabraLoas } from '../../dto/Sislabra/interfaces/IResponseSislabraLoas';
import { ISislabraGF } from '../../dto/Sislabra/interfaces/ISislabraGF';
import { IImpedimentosLoas } from '../../dto/Sislabra/interfaces/IImpedimentosLoas';

export async function impedimentosSislabraLOAS(labrasPoloAtivo: ResponseArvoreDeDocumentoDTO[], labrasGF: ISislabraGF, cookie: string): Promise<IResponseSislabraLoas> {
    let response = '';
    let impedimentosAutor: IImpedimentosLoas;
    let impedimentosGF: IImpedimentosLoas[] = [];

    if (labrasPoloAtivo.length > 0) {
        for (let labra of labrasPoloAtivo) {
            const idSislabraParaPesquisa = labra.documentoJuntado.componentesDigitais[0].id;
            const paginaSislabra = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisa });
            const paginaFormatada = new JSDOM(paginaSislabra);
            const sislabraPoloAtivo = await getDocumentSislabraFromSapiensLoas.execute(paginaFormatada, true);
            if (!response.includes(sislabraPoloAtivo.impedimentos)) {
                response += sislabraPoloAtivo.impedimentos;
                impedimentosAutor = sislabraPoloAtivo.objImpedimentos;
            }
        }
    }

    if (!labrasGF.isGrupoFamiliarAusente && labrasGF.labrasGrupoFamiliar.length > 0) {
        for (let labra of labrasGF.labrasGrupoFamiliar) {
            const idSislabraParaPesquisaGF = labra.documentoJuntado.componentesDigitais[0].id;
            const paginaSislabraGF = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisaGF });
            const paginaFormatadaGF = new JSDOM(paginaSislabraGF);
            const sislabraGF = await getDocumentSislabraFromSapiensLoas.execute(paginaFormatadaGF, false);
            response += sislabraGF.impedimentos;
            impedimentosGF.push(sislabraGF.objImpedimentos);
        }
    } else if (!labrasGF.isGrupoFamiliarAusente && labrasGF.labrasGrupoFamiliar.length === 0) {
        response += " SISLABRA GF NÃO EXISTE -";
    }

    const impedimentosString = response.split('-')
    
    const impedimentos: IResponseSislabraLoas = {
        impedimentos: impedimentosString,
        autor: impedimentosAutor,
        gf: impedimentosGF
    }

    return impedimentos;
}