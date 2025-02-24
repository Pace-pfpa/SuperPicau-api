import dotenv from 'dotenv';
dotenv.config();

/**
 * Porta da API carregada a partir das variáveis de ambiente.
 */
const PORT = process.env.API_PORT;

/**
 * URL base da API para desenvolvimento local.
 */
const urlAPI = `http://localhost:${PORT}`;

/**
 * Porta da API para execução em ambiente Docker, carregada a partir das variáveis de ambiente.
 */
const PORT_DOCKER = process.env.PORT_DOCKER;

/**
 * URL base da API para execução dentro do Docker.
 */
const urlDOCKER = `http://localhost:${PORT_DOCKER}`;


/**
 * Definição da configuração do Swagger para a API VISÃO.
 * 
 * - Define a especificação OpenAPI 3.0.0.
 * - Contém informações sobre a API, incluindo título, versão e descrição.
 * - Define os servidores disponíveis para acesso à API.
 * 
 * @see [OpenAPI Specification](https://swagger.io/specification/)
 */
export const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'VISÃO. API to perform screening in SAPIENS',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from SAPIENS.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'GITHUB PROJECT',
        url: 'https://github.com/Pace-pfpa/SuperPicau-api.git',
      },
    },
    servers: [
      {
        url: urlAPI,
        description: 'Development server',
      },
      {
        url: urlDOCKER,
        description: 'Development server in the docker',
      },
    ],
  };

  /**
  * Configuração das opções do Swagger para documentação da API.
  * 
  * - Usa `swaggerDefinition` como base.
  * - Define os caminhos onde as definições OpenAPI devem ser extraídas.
  */
  export const Options = {
    swaggerDefinition,
    /**
     * Caminhos dos arquivos que contêm definições OpenAPI.
     * 
     * @example
     * - Rotas: `./src/routes/*.ts`
     * - Entidades: `./src/entities/*.ts`
     * - Módulos: `./src/modules/*.ts`
     * - Tipos: `./src/type/*.ts`
     * - DTOs: `./src/DTO/*.ts`
     */
    apis: [
      './src/routes/*.ts', 
      './src/entities/*.ts', 
      './src/modules/*/*.ts', 
      './src/type/*.ts', 
      './src/DTO/*.ts'
    ],
};