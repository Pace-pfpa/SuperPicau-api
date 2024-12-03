import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { RequestGetUsuario } from "../../sapiensOperations/resquest/RequestGetUsuario";
import { UsuarioResponseDTO } from "./dtos/UsuarioResponseDTO";

export class GetUsuarioUseCase {
    constructor(private readonly requestGetUsuario:RequestGetUsuario){};
    async execute(cookie: string): Promise<UsuarioResponseDTO[]> {

        const getUsuario = await this.requestGetUsuario.execute();
        
        const response = (await RequestSapiens(cookie, getUsuario));
        
        return response;
    }
}