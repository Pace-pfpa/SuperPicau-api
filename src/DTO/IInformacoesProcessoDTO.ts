import { IInfoUploadDTO } from "./IInfoUploadDTO"

export interface IInformacoesProcessoDTO {
    tarefaId: number,
    cookie: string,
    tipo_triagem: Number,
    capaFormatada: string,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dosprevPoloAtivo: any[],
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: any,
    sislabraConjuge: any
}