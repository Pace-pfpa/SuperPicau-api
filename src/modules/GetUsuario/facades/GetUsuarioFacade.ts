import { UsuarioResponseDTO, getUsuarioUseCase } from '..';

export class GetUsuarioFacade {
  async getUsuario(cookie: string): Promise<UsuarioResponseDTO[]> {
    try {
        return await getUsuarioUseCase.execute(cookie);
      } catch (error) {
        throw new Error(`Erro ao obter usuário: ${error.message}`);
      }
  }
}
