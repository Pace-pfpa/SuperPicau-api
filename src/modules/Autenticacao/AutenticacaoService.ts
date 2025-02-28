import { autenticarUsuarioFacade } from ".";
import { LoginDTO } from "../LoginUsuario";
import { IUsuarioUpload } from "./dtos/IUsuarioUpload";

export class AutenticacaoService {
    async autenticar(
        login: LoginDTO
    ): Promise<{ cookie: string; usuario: IUsuarioUpload }> {
        return await autenticarUsuarioFacade.autenticarUsuario(login);
    }
}