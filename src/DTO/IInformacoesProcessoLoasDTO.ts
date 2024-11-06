import { ResponseArvoreDeDocumento } from "../modules/GetArvoreDocumento/DTO";
import { IInformacoesProcessoDTO } from "./IInformacoesProcessoDTO"
import { IInfoUploadDTO } from "./IInfoUploadDTO";
import { JSDOM } from 'jsdom';

export interface IInformacoesProcessoLoasDTO {
    tarefaId: number,
    tarefaPastaID: number;
    cookie: string,
    tipo_triagem: Number,
    capaFormatada: JSDOM,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dosprevPoloAtivo: ResponseArvoreDeDocumento,
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: any[],
    sislabraGF: any[],
    dossieSocialInfo: IDossieSocialInfo;
    arrayDeDossiesNormais: ResponseArvoreDeDocumento[],
    arrayDeDossiesSuper: ResponseArvoreDeDocumento[]
}

export interface IDossieSocialInfo {
    gastoComMedicamentos: boolean;
    grupoFamiliarCpfs: string[];
}

export type ExecuteReturnType =
     | [IInformacoesProcessoDTO, 'RURAL/MATERNIDADE'] 
     | [IInformacoesProcessoLoasDTO, 'LOAS']
     | {warning: string};