import { ICreateDocumentDTO } from "../../modules/CreateDocumento/dtos/ICreateDocumentDTO";

/**
 * Serviço responsável por gerar a estrutura do payload para criação de um documento no Sapiens.
 * 
 * - Formata os dados do documento em uma string JSON.
 * - Define valores padrão caso alguns campos estejam ausentes.
 * 
 * @example
 * ```ts
 * const requestCreateDocumento = new RequestCreateDocumento();
 * const payload = await requestCreateDocumento.execute({
 *   cookie: "session_cookie",
 *   pasta_id: 123,
 *   usuario_nome: "Seu Afonso",
 *   usuario_setor: 10,
 *   tarefa_id: 456,
 *   tid: "ABC123",
 *   tipoDocumento_id: "789",
 *   modelo_id: "101"
 * });
 * console.log(payload); // Retorna a string JSON formatada
 * ```
 */
export class RequestCreateDocumento {
    /**
     * Gera o payload JSON para criação de um documento no Sapiens.
     * 
     * - Se `tipoDocumento_id` estiver ausente ou vazio, define como `"35"`.
     * - Se `modelo_id` estiver ausente ou vazio, define como `""`.
     * - Retorna uma string JSON formatada para ser enviada na requisição.
     * 
     * @param data Objeto contendo os dados do documento.
     * @returns Uma string JSON contendo o payload formatado.
     * 
     * @example
     * ```ts
     * const payload = await requestCreateDocumento.execute({
     *   cookie: "session_cookie",
     *   pasta_id: 123,
     *   usuario_nome: "Afonsito",
     *   usuario_setor: 10,
     *   tarefa_id: 456,
     *   tid: "ABC123",
     *   tipoDocumento_id: "789",
     *   modelo_id: "101"
     * });
     * console.log(payload);
     * ```
     */
    async execute(data: ICreateDocumentDTO): Promise<string> {
        if(data.tipoDocumento_id == null || data.tipoDocumento_id == ""){
            data.tipoDocumento_id = "35"
        }
        if(data.modelo_id == null || data.modelo_id == ""){
            data.modelo_id = ""
        }
        const createDocumento = `{
            "action":"SapiensAdministrativo_Documento",
            "method":"createDocumento",
            "data":[
               {
                  "numeroFolhas":3,
                  "dataHoraProducao":"",
                  "localProducao":"",
                  "vinculado":false,
                  "copia":false,
                  "observacao":"",
                  "autor":"${data.usuario_nome}",
                  "pasta_id":${data.pasta_id},
                  "redator":"${data.usuario_nome}",
                  "procedencia_id":"",
                  "tipoDocumento_id":${data.tipoDocumento_id},
                  "modelo_id":"${data.modelo_id}",
                  "comunicacaoRemessa_id":"",
                  "setorOrigem_id":${data.usuario_setor},
                  "tarefaOrigem_id":${data.tarefa_id},
                  "visibilidadeRestrita":false,
                  "semEfeito":false,
                  "localizadorOriginal":"",
                  "minuta":true,
                  "outroNumero":"",
                  "criadoPor_id":"",
                  "origemDados_id":"",
                  "atualizadoPor_id":"",
                  "anexaCopia":"",
                  "descricaoOutros":"",
                  "anexaCopiaVinculados":false,
                  "parentId":null,
                  "leaf":false
               }
            ],
            "type":"rpc",
            "tid":${data.tid}
         }`
        
        return createDocumento;
    }
}