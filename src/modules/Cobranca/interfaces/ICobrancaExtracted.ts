import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { IInfoUploadDTO } from "../../GetInformationFromSapiensForPicaPau/dto";

export interface ICobrancaExtracted {
    cookie: string
    tarefaId: number
    infoUpload: IInfoUploadDTO
    capa: JSDOMType;
    sislabra: JSDOMType[];
}