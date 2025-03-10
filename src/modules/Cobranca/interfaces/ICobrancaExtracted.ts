import { JSDOMType } from "../../../shared/dtos/JSDOM";

export interface ICobrancaExtracted {
    infoUpload: {
        cookie: string;
        tarefaId: number;
    }
    capa: JSDOMType;
    sislabra: JSDOMType;
}