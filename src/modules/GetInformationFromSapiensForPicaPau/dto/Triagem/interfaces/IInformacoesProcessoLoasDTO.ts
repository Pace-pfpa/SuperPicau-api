import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../../../GetArvoreDocumento";
import { IDossieExtractedPartial } from "../../../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";
import { ISislabraGF } from "../../Sislabra/interfaces/ISislabraGF";
import { IDossieSocialInfo } from "./IDossieSocialInfo";
import { IInfoUploadDTO } from "./IInfoUploadDTO";

export interface IInformacoesProcessoLoasDTO {
    tarefaId: number,
    tarefaPastaID: number;
    cookie: string,
    tipo_triagem: number,
    isUserAdmin: boolean,
    capaFormatada: JSDOMType,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dossie: {
        dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO,
        isDosprevPoloAtivoNormal: boolean,
        dossieFormatado: JSDOMType,
        dossieExtractedPartial: IDossieExtractedPartial,
        arrayDeDossiesNormais: ResponseArvoreDeDocumentoDTO[],
        arrayDeDossiesSuper: ResponseArvoreDeDocumentoDTO[]
    },
    sislabra: {
        sislabraPoloAtivo: JSDOMType[],
        sislabraGFInfo: ISislabraGF,
    }
    dossieSocialInfo: IDossieSocialInfo | null;
}