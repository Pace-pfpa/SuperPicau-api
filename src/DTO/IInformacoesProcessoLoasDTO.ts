import { IInformacoesProcessoDTO } from "./IInformacoesProcessoDTO"
export interface IInformacoesProcessoLoasDTO {
    tarefaId: number,
    tarefaPastaID: number;
    cookie: string,
    tipo_triagem: Number,
    capaFormatada: string,
    cpfCapa: string,
    arrayDeDocumentos: any[],
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