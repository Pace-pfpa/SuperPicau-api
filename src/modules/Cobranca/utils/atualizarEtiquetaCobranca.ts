import { updateEtiquetaUseCase } from "../../UpdateEtiqueta";

export async function atualizarEtiquetaCobranca(
    cookie: string, 
    postIt: string, 
    tarefaId: number
): Promise<void> {
    await updateEtiquetaUseCase.execute({
        cookie,
        etiqueta: `${postIt}`,
        tarefaId
    });
}
