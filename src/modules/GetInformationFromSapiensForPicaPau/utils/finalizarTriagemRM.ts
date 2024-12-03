import { minutaClass } from "../classes";
import { IInformacoesProcessoDTO, IObjInfoImpeditivosRM, IResponseLabraAutorConjuge } from "../dto";
import { atualizarEtiquetaImpeditivo } from "./atualizarEtiquetaImpeditivo";
import { atualizarEtiquetaProcessoLimpo } from "./atualizarEtiquetaProcessoLimpo";
import { isProcessoLimpo } from "./isProcessoLimpo";

// TODO: Tem que terminar essa finalização ainda
export async function finalizarTriagemRM(
    impeditivos: string[], 
    impeditivosLabrasRM: IResponseLabraAutorConjuge,
    impeditivosDosprevRM: IObjInfoImpeditivosRM,
    informacoesProcessoRM: IInformacoesProcessoDTO): Promise<{ impeditivos: boolean }> {

    const isRural = informacoesProcessoRM.tipo_triagem === 0;
    const isMaternidade = informacoesProcessoRM.tipo_triagem === 1;

    if (isProcessoLimpo(impeditivos)) {

        if (informacoesProcessoRM.isUserAdmin && isMaternidade) {
            try {
                await minutaClass.maternidadeProcessoLimpo(informacoesProcessoRM);
                await new Promise(resolve => setTimeout(resolve, 5000));    
            } catch (error) {
                console.error("Erro na função finalizarTriagem ao subir a minuta (maternidade): ", error);
            }
            
        }

        await atualizarEtiquetaProcessoLimpo(informacoesProcessoRM.cookie, informacoesProcessoRM.tarefaId);
        return {impeditivos: true}
        
    } else {

        const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*') && !imp.includes('*MATERNIDADE*') && !imp.includes('*LOAS*'));
        
        const impeditivosString = relevantes.join(' - ');

        if (isRural) {
            await atualizarEtiquetaImpeditivo(informacoesProcessoRM.cookie, `RURAL IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoRM.tarefaId);
        } else if (isMaternidade) {
            await atualizarEtiquetaImpeditivo(informacoesProcessoRM.cookie, `MATERNIDADE IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoRM.tarefaId);
        }

        return {impeditivos: false}
    }
    
}
