/**
 * @group CreateDocumento
 * DTO para criação de documentos no Sapiens.
 * 
 * - Contém os dados necessários para a requisição de criação de um documento.
 * - Alguns campos são opcionais (`tipoDocumento_id` e `modelo_id`).
 * 
 * @example
 * ```ts
 * const dto: ICreateDocumentDTO = {
 *   cookie: "session_cookie",
 *   pasta_id: 123,
 *   usuario_nome: "João Silva",
 *   usuario_setor: 10,
 *   tarefa_id: 456,
 *   tid: "ABC123",
 *   tipoDocumento_id: "789",
 *   modelo_id: "101"
 * };
 * ```
 */
export interface ICreateDocumentDTO {
    /** Cookie de autenticação da sessão do usuário. */
    cookie: string
    /** ID da pasta onde o documento será armazenado. */
    pasta_id: number;
    /** Nome do usuário solicitante. */
    usuario_nome: string
    /** ID do setor do usuário solicitante. */
    usuario_setor: number;
    /** ID da tarefa associada ao documento. */
    tarefa_id: number;
     /** Identificador único da transação/documento. */
    tid: string;
    /** ID do tipo de documento (opcional). 
     * CONSTESTAÇÃO -> 85
     * RELATÓRIO -> 35
    */
    tipoDocumento_id?: string;
    /** 
     * ID do modelo de documento a ser utilizado (opcional).
     * RURAL -> 613060 (LIMPO) | 546274 (SUJO)
     * MATERNIDADE -> 726514 (LIMPO) | 609682 (SUJO)
     * LOAS -> 613060 (LIMPO) | 734226 (SUJO)
     */
    modelo_id?: string;
}
