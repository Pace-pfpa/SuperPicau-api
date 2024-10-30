import { IInformacoesProcessoDTO } from "./IInformacoesProcessoDTO"
import { IInfoUploadDTO } from "./IInfoUploadDTO";
export interface IInformacoesProcessoLoasDTO {
    tarefaId: number,
    tarefaPastaID: number;
    cookie: string,
    tipo_triagem: Number,
    capaFormatada: string,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dosprevPoloAtivo: any[],
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: any[],
    sislabraGF: any[],
    dossieSocialInfo: {
        gastosComMedicamentos: boolean,
        grupoFamiliarCpfs: string[]
    },
    arrayDeDossiesNormais: any[],
    arrayDeDossiesSuper: any[]
}

export type ExecuteReturnType =
     | [IInformacoesProcessoDTO, 'RURAL/MATERNIDADE'] 
     | [IInformacoesProcessoLoasDTO, 'LOAS']
     | {warning: string};