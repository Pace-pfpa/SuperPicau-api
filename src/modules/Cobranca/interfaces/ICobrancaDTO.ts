import { ITarefaResponse } from "../../GetTarefa/dtos";
import { LoginDTO } from "../../LoginUsuario";

/**
 * @group Cobrança
 * DTO para a triagem de processos do tipo "cobrança".
 * 
 * - Contém os dados necessários para a requisição de triagem.
 * - Alguns campos são opcionais (`tipoDocumento_id` e `modelo_id`).
 * 
 * @example
 * ```ts
 * const tarefaMetadados: ITarefaResponse = arrayTarefas[0];
 * const dto: ICobrancaDTO = {
 *   login: {
 *      cpf: "01010110111",
 *      senha: "tuEhFresco"
 *   },
 *   etiqueta: "SAMARAS",
 *   tarefa: tarefaMetadados
 * };
 * ```
 */
export interface ICobrancaDTO {
    /** Login do SAPIENS, contém CPF e senha. */
    login: LoginDTO;
    /** Etiqueta referente aos processos a serem triados. */
    etiqueta: string;
    /** Tarefa já em forma de resposta do SAPIENS, enviada do Front. */
    tarefa: ITarefaResponse;
}
