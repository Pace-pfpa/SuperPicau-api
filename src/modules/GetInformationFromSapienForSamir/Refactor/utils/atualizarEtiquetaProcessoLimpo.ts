import { updateEtiquetaUseCase } from "../../../UpdateEtiqueta";

export async function atualizarEtiquetaProcessoLimpo(cookie: string, tarefaId: number): Promise<void> {
    await updateEtiquetaUseCase.execute({
        cookie,
        etiqueta: `PROCESSO LIMPO`,
        tarefaId
    });
}