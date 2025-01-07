import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../../../GetArvoreDocumento";
import { ISislabraGF } from "../../Sislabra/interfaces/ISislabraGF";
import { IDossieSocialInfo } from "./IDossieSocialInfo";
import { IInfoUploadDTO } from "./IInfoUploadDTO";

export interface IInformacoesProcessoLoasDTO {
    tarefaId: number,
    tarefaPastaID: number;
    cookie: string,
    tipo_triagem: number,
    isUserAdmin: boolean,
    capaFormatada: JSDOMType,
    cpfCapa: string,
    infoUpload: IInfoUploadDTO,
    dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO,
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO[],
    sislabraGFInfo: ISislabraGF,
    dossieSocialInfo: IDossieSocialInfo | null;
    arrayDeDossiesNormais: ResponseArvoreDeDocumentoDTO[],
    arrayDeDossiesSuper: ResponseArvoreDeDocumentoDTO[]
}