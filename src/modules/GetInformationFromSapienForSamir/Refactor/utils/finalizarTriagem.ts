import { atualizarEtiquetaImpeditivo } from "./atualizarEtiquetaImpeditivo";
import { atualizarEtiquetaProcessoLimpo } from "./atualizarEtiquetaProcessoLimpo";

export async function finalizarTriagem(impeditivos: string[], cookie: string, tarefaId: number) {
    if (isProcessoLimpo(impeditivos)) {
        await atualizarEtiquetaProcessoLimpo(cookie, tarefaId);
        return {impeditivos: true}
    } else {

        const isRural = impeditivos.find(imp => imp.includes('*RURAL*'));
        const isMaternidade = impeditivos.find(imp => imp.includes('*MATERNIDADE*'));
        const isLOAS = impeditivos.find(imp => imp.includes('*LOAS*'));

        const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*') && !imp.includes('*MATERNIDADE*') && !imp.includes('*LOAS*'));
        
        const impeditivosString = relevantes.join(' - ');

        if (isRural) {
            await atualizarEtiquetaImpeditivo(cookie, `RURAL IMPEDITIVOS: ${impeditivosString}`, tarefaId);
        } else if (isMaternidade) {
            await atualizarEtiquetaImpeditivo(cookie, `MATERNIDADE IMPEDITIVOS: ${impeditivosString}`, tarefaId);
        } else if (isLOAS) {
            await atualizarEtiquetaImpeditivo(cookie, `LOAS IMPEDITIVOS: ${impeditivosString}`, tarefaId);
        }

        return {impeditivos: false}
    }
}

function isProcessoLimpo(impeditivos: string[]): boolean {
    const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*') && !imp.includes('*MATERNIDADE*') && !imp.includes('*LOAS*'));
    return relevantes.length === 0;
}