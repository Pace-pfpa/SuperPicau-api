import { LoginDTO, loginUseCase } from '..';

export class LoginUsuarioFacade {
  async login(data: LoginDTO): Promise<string> {
    try {
        return await loginUseCase.execute(data);
      } catch (error) {
        throw new Error(`Erro ao realizar login: ${error.message}`);
      }
  }
}
