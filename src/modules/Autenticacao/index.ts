import { AutenticacaoService } from './AutenticacaoService';
import { AutenticarUsuarioFacade } from './facades/AutenticarUsuarioFacade';

export const autenticacaoService = new AutenticacaoService();
export const autenticarUsuarioFacade = new AutenticarUsuarioFacade();

export * from './facades/AutenticarUsuarioFacade';