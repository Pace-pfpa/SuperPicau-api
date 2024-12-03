
import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../../../GetArvoreDocumento";
import { IInfoUploadDTO } from "./IInfoUploadDTO";

export interface IInformacoesProcessoDTO {
    tarefaId: number,
    cookie: string,
    tipo_triagem: number,
    isUserAdmin: boolean,
    capaFormatada: JSDOMType,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO,
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO,
    sislabraConjuge: ResponseArvoreDeDocumentoDTO
}