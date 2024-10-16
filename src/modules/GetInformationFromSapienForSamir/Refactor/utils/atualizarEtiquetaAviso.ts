import { updateEtiquetaUseCase } from "../../../UpdateEtiqueta";

export async function atualizarEtiquetaAviso(cookie: string, postIt: string, tarefaId: number) {
    await updateEtiquetaUseCase.execute({
        cookie,
        etiqueta: `AVISO: ${postIt}`,
        tarefaId
    });
}