import { RequestCreateDocumento } from '../../sapiensOperations/resquest/RequestCreateDocumento';
import { CreateDocumentoController } from './CreateDocumentoController';
import { CreateDocumentoUseCase } from './CreateDocumentoUseCase';

/**
 * @group CreateDocumento
 * Instância do serviço responsável por gerar o payload para a criação de documentos no Sapiens.
 * 
 * - Transforma os dados recebidos em um formato JSON compatível com o SAPIENS.
 * - Define valores padrão para campos opcionais.
 */
const requestCreateDocumento = new RequestCreateDocumento();

/**
 * @group CreateDocumento
 * Instância do caso de uso responsável por orquestrar o processo de criação de documentos.
 * 
 * - Usa `RequestCreateDocumento` para gerar o payload.
 * - Envia a requisição ao Sapiens e processa a resposta.
 */
const createDocumentoUseCase = new CreateDocumentoUseCase(requestCreateDocumento);

/**
 * @group CreateDocumento
 * Instância do controlador responsável por lidar com requisições HTTP relacionadas à criação de documentos.
 * 
 * - Recebe os dados via `request.body`.
 * - Valida os dados e chama `CreateDocumentoUseCase`.
 * - Retorna a resposta ao cliente.
 */
const createDocumentoController = new CreateDocumentoController(createDocumentoUseCase);

export { createDocumentoUseCase, createDocumentoController };

// EXPORT FOR DOCS
export * from '.';
export * from './CreateDocumentoController';
export * from './CreateDocumentoUseCase';
export * from './dtos/ICreateDocumentDTO';