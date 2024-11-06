import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { RequestGetUsuario } from "../../sapiensOperations/resquest/RequestGetUsuario";
import { IUsuarioResponse } from "./DTO/IUsuarioResponse";

export class GetUsuarioUseCase {
    constructor(private RequestGetUsuario:RequestGetUsuario){};
    async execute(cookie: string): Promise<IUsuarioResponse[]> {

        const getUsuario = await this.RequestGetUsuario.execute();
        
        const response = (await RequestSapiens(cookie, getUsuario));
        
        return response;
    }
}