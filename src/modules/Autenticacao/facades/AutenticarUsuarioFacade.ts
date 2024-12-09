import { GetInformationsFromSapiensDTO } from "../../GetInformationFromSapiensForPicaPau";
import { UsuarioResponseDTO, GetUsuarioFacade } from "../../GetUsuario";
import { LoginUsuarioFacade } from "../../LoginUsuario";

export class AutenticarUsuarioFacade {
    private readonly loginUsuarioFacade = new LoginUsuarioFacade();
    private readonly getUsuarioFacade = new GetUsuarioFacade();

    async autenticarUsuario(data: GetInformationsFromSapiensDTO): Promise<{ cookie: string; usuario: UsuarioResponseDTO[] }> {
        try {
            const cookie = await this.loginUsuarioFacade.login(data.login);
            const usuario = await this.getUsuarioFacade.getUsuario(cookie);
            return { cookie, usuario };
        } catch (error) {
            throw new Error(`Erro ao autenticar usuário: ${error.message}`);
        }
    }
}
