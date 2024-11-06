import { ResponseArvoreDeDocumento } from "../modules/GetArvoreDocumento/DTO";
import { IInfoUploadDTO } from "./IInfoUploadDTO"
import { JSDOM } from 'jsdom';

export interface IInformacoesProcessoDTO {
    tarefaId: number,
    cookie: string,
    tipo_triagem: Number,
    capaFormatada: JSDOM,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dosprevPoloAtivo: ResponseArvoreDeDocumento,
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: any,
    sislabraConjuge: any
}