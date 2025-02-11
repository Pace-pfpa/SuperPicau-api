
import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../../../GetArvoreDocumento";
import { IDossieExtractedPartial } from "../../../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";
import { IInfoUploadDTO } from "./IInfoUploadDTO";

export interface IInformacoesProcessoDTO {
    tarefaId: number,
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
    },
    sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO,
    sislabraConjuge: ResponseArvoreDeDocumentoDTO
}