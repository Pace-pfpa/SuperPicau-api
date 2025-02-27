import { GetUsuarioFacade } from "../../GetUsuario";
import { LoginDTO, LoginUsuarioFacade } from "../../LoginUsuario";
import { IUsuarioUpload } from "../dtos/IUsuarioUpload";

export class AutenticarUsuarioFacade {
    private readonly loginUsuarioFacade = new LoginUsuarioFacade();
    private readonly getUsuarioFacade = new GetUsuarioFacade();

    async autenticarUsuario(data: LoginDTO): Promise<{ cookie: string; usuario: IUsuarioUpload }> {
        try {
            const cookie = await this.loginUsuarioFacade.login(data);
            const usuario_busca = await this.getUsuarioFacade.getUsuario(cookie);

            const usuario_id = `${usuario_busca[0].id}`;
            const usuario_nome = usuario_busca[0].nome;
            const usuario_unidade = usuario_busca[0].colaborador.lotacoes[0].setor.unidade.nome;
            const usuario_setor = usuario_busca[0].colaborador.lotacoes[0].setor.nome;
            const usuario_setor_endereco = usuario_busca[0].colaborador.lotacoes[0].setor.endereco;
            const usuario_cargo = usuario_busca[0].assinaturaHTML;
            const partes = usuario_cargo?.split('\n');
            const cargo = partes[1]?.trim();

            const usuario: IUsuarioUpload = {
                id: usuario_id,
                nome: usuario_nome,
                unidade: usuario_unidade,
                setor: usuario_setor,
                endereco: usuario_setor_endereco,
                cargo
            }

            return { cookie, usuario };
        } catch (error) {
            throw new Error(`Erro ao autenticar usuário: ${error.message}`);
        }
    }

}
