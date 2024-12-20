import { IInformacoesProcessoDTO } from "../interfaces/IInformacoesProcessoDTO";
import { IInformacoesProcessoLoasDTO } from "../interfaces/IInformacoesProcessoLoasDTO";

export type ExecuteReturnType =
     | [IInformacoesProcessoDTO, 'RURAL/MATERNIDADE'] 
     | [IInformacoesProcessoLoasDTO, 'LOAS']
     | {warning: string};