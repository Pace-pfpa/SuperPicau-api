
import { GetInformationsFromSapiensDTO } from "../../GetInformationFromSapienForSamir/Refactor";
import { UsuarioResponseDTO, GetUsuarioFacade } from "../../GetUsuario";
import { LoginUsuarioFacade } from "../../LoginUsuario";

export class AutenticarUsuarioFacade {
    private loginUsuarioFacade = new LoginUsuarioFacade();
    private getUsuarioFacade = new GetUsuarioFacade();

    async autenicarUsuario(data: GetInformationsFromSapiensDTO): Promise<{ cookie: string; usuario: UsuarioResponseDTO[] }> {
        try {
            const cookie = await this.loginUsuarioFacade.login(data.login);
            const usuario = await this.getUsuarioFacade.getUsuario(cookie);
            return { cookie, usuario };
        } catch (error) {
            throw new Error(`Erro ao autenticar usuário: ${error.message}`);
        }
    }
}
