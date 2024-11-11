
import { ResponseArvoreDeDocumentoDTO } from "../modules/GetArvoreDocumento";
import { IInformacoesProcessoDTO } from "./IInformacoesProcessoDTO"
import { IInfoUploadDTO } from "./IInfoUploadDTO";
import { JSDOM } from 'jsdom';

export interface IInformacoesProcessoLoasDTO {
    tarefaId: number,
    tarefaPastaID: number;
    cookie: string,
    tipo_triagem: Number,
    isUserAdmin: boolean,
    capaFormatada: JSDOM,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO,
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: any[],
    sislabraGF: any[],
    dossieSocialInfo: IDossieSocialInfo;
    arrayDeDossiesNormais: ResponseArvoreDeDocumentoDTO[],
    arrayDeDossiesSuper: ResponseArvoreDeDocumentoDTO[]
}

export interface IDossieSocialInfo {
    gastoComMedicamentos: boolean;
    grupoFamiliarCpfs: string[];
}

export type ExecuteReturnType =
     | [IInformacoesProcessoDTO, 'RURAL/MATERNIDADE'] 
     | [IInformacoesProcessoLoasDTO, 'LOAS']
     | {warning: string};