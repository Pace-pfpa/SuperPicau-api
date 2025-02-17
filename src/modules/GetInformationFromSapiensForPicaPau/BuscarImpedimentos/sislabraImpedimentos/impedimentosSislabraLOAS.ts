import { getDocumentSislabraFromSapiensLoas } from "../../GetDocumentSislabraFromSapiens";
import { IResponseSislabraLoas } from '../../dto/Sislabra/interfaces/IResponseSislabraLoas';
import { ISislabraGF } from '../../dto/Sislabra/interfaces/ISislabraGF';
import { IImpedimentosLoas } from '../../dto/Sislabra/interfaces/IImpedimentosLoas';
import { JSDOMType } from '../../../../shared/dtos/JSDOM';

export async function impedimentosSislabraLOAS(
    labrasPoloAtivo: JSDOMType[], 
    labrasGF: ISislabraGF,
): Promise<IResponseSislabraLoas> {
    let response = '';
    let impedimentosAutor: IImpedimentosLoas;
    let impedimentosGF: IImpedimentosLoas[] = [];

    if (labrasPoloAtivo.length > 0) {
        for (let labra of labrasPoloAtivo) {
            const sislabraPoloAtivo = await getDocumentSislabraFromSapiensLoas.execute(labra, true);
            if (!response.includes(sislabraPoloAtivo.impedimentos)) {
                response += sislabraPoloAtivo.impedimentos;
                impedimentosAutor = sislabraPoloAtivo.objImpedimentos;
            }
        }
    }

    if (!labrasGF.isGrupoFamiliarAusente && labrasGF.labrasGrupoFamiliar.length > 0) {
        for (let labra of labrasGF.labrasGrupoFamiliar) {
            const sislabraGF = await getDocumentSislabraFromSapiensLoas.execute(labra, false);
            if (!response.includes(sislabraGF.impedimentos)) {
                response += sislabraGF.impedimentos;
                impedimentosGF.push(sislabraGF.objImpedimentos);
            }
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