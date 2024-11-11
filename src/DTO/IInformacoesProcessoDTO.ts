
import { ResponseArvoreDeDocumentoDTO } from "../modules/GetArvoreDocumento";
import { IInfoUploadDTO } from "./IInfoUploadDTO"
import { JSDOM } from 'jsdom';

export interface IInformacoesProcessoDTO {
    tarefaId: number,
    cookie: string,
    tipo_triagem: Number,
    isUserAdmin: boolean,
    capaFormatada: JSDOM,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO,
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: any,
    sislabraConjuge: any
}