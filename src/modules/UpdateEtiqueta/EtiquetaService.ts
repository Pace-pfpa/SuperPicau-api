import { atualizarEtiquetaAviso } from "../GetInformationFromSapiensForPicaPau/utils";

export class EtiquetaService {
    /**
     * Atualiza a etiqueta de uma tarefa e decide se o erro é tratado ou não.
     * Método para etiquetas do tipo "AVISO".
     * @param cookie - Cookie de autenticação.
     * @param mensagem - Mensagem a ser incluída na etiqueta.
     * @param tarefaId - ID da tarefa.
     * @param erroTratado - Indica se o erro é tratado (deve retornar `success: false`).
     * @throws {Error} - Lança um erro se `erroTratado` for `false`.
     */
    async aviso(
        cookie: string,
        mensagem: string,
        tarefaId: number,
        erroTratado: boolean = true
    ): Promise<void> {
        await atualizarEtiquetaAviso(cookie, mensagem, tarefaId);

        if (!erroTratado) {
            throw new Error(mensagem); // Erro não tratado, lança exceção
        }
    }
}