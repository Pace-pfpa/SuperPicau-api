import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { RequestGetUsuario } from "../../sapiensOperations/resquest/RequestGetUsuario";
import { UsuarioResponseDTO } from "./dtos/UsuarioResponseDTO";

export class GetUsuarioUseCase {
    constructor(private RequestGetUsuario:RequestGetUsuario){};
    async execute(cookie: string): Promise<UsuarioResponseDTO[]> {

        const getUsuario = await this.RequestGetUsuario.execute();
        
        const response = (await RequestSapiens(cookie, getUsuario));
        
        return response;
    }
}